import { postElectrum } from '../callCreators'
import { getUnspentFormatted } from './getUnspent';
import { maxSpendBalance, satsToCoins, coinsToSats } from '../../../../math'
import coinSelect from 'coinselect';
import { buildSignedTx } from '../../../../crypto/buildTx'
import { TxDecoder } from '../../../../crypto/txDecoder'
import { ELECTRUM } from '../../../../constants/intervalConstants';
import BigNumber from 'bignumber.js';

export const pushTx = (coinObj, _rawtx) => {
  const callType = 'pushtx'
  let serverList = coinObj.serverList
  let data = { rawtx: _rawtx }

  return new Promise((resolve, reject) => {
    postElectrum(serverList, callType, data)
    .then((response) => {
      if(!response || !response.result) {
        resolve({
          err: true,
          result: response
        })
      }
      else {
        resolve({
          err: false,
          result: {
            txid: response.result,
            params: {}
          },
        })
      }
    })
  });
}

export const txPreflight = (coinObj, activeUser, outputAddress, value, params) => {
  let { defaultFee, network, verifyMerkle, verifyTxid } = params
  value = coinsToSats(value)

  return new Promise((resolve, reject) => {
    getUnspentFormatted(coinObj, activeUser, verifyMerkle, verifyTxid)
    .then((res) => {
      utxoList = res.utxoList
      let unshieldedFunds = res.unshieldedFunds
      
      if (utxoList &&
        utxoList.length) {
      let utxoListFormatted = [];
      let totalInterest = 0;
      let interestClaimThreshold = 200;
      let utxoVerified = true;
      let electrumKey
      let changeAddress
      let feePerByte = 0;
      let btcFees = false;
      let feeTakenFromAmount = false
      let amountSubmitted = value

      if (
        typeof defaultFee === "object" &&
        typeof defaultFee !== "null" &&
        defaultFee.feePerByte != null
      ) {
        //BTC Fee style detected, changing fee unit to fee per byte and
        //feeding value into coinselect
        feePerByte = defaultFee.feePerByte.toNumber();
        defaultFee = BigNumber(0);
        btcFees = true;
      }

      if (
        activeUser.keys[coinObj.id] != null &&
        activeUser.keys[coinObj.id].electrum != null &&
        activeUser.keys[coinObj.id].electrum.addresses.length > 0
      ) {
        electrumKey = activeUser.keys[coinObj.id][ELECTRUM].privKey;
        changeAddress = activeUser.keys[coinObj.id].electrum.addresses[0];
      } else {
        throw new Error(
          "pushTx.js: Fatal mismatch error, " +
            activeUser.id +
            " user keys for active coin " +
            coinObj.id +
            " not found!"
        );
      }

      console.log('Utxo list ==>') 
      console.log(utxoList)

      for (let i = 0; i < utxoList.length; i++) {
        if (network.coin === 'komodo' ||
            network.coin === 'kmd') {
          utxoListFormatted.push({
            txid: utxoList[i].txid,
            vout: utxoList[i].vout,
            value: utxoList[i].amountSats,
            interestSats: utxoList[i].interestSats,
            verifiedMerkle: utxoList[i].verifiedMerkle,
            verifiedTxid: utxoList[i].verifiedTxid
          });
        } else {
          utxoListFormatted.push({
            txid: utxoList[i].txid,
            vout: utxoList[i].vout,
            value: utxoList[i].amountSats,
            verified: utxoList[i].verified ? utxoList[i].verified : false,
            verifiedMerkle: utxoList[i].verifiedMerkle,
            verifiedTxid: utxoList[i].verifiedTxid
          });
        }
      }

      const _maxSpendBalance = maxSpendBalance(utxoListFormatted);

      let targets = [{
        address: outputAddress,
        value: value
      }]

      //If a no fee per byte is passed, the default transaction fee is used
      if (feePerByte === 0) {
        //if transaction value is more than what is spendable with fee included, subtract fee from amount
        //else, add fee to amount to take fee from wallet  
        if (value.isGreaterThan((_maxSpendBalance.minus(defaultFee)))) {
          console.log('subtracting default fee from amount...')
          amountSubmitted = value
          value = _maxSpendBalance.minus(defaultFee)
          targets[0].value = _maxSpendBalance

          feeTakenFromAmount = true
        } else {
          targets[0].value = targets[0].value.plus(defaultFee)
        }
      }

      console.log('transaction targets =>');
      console.log(targets);
      console.log('searching for utxos...')

      targets[0].value = targets[0].value.toNumber()
      
      let {
        inputs,
        outputs,
        fee
      } = coinSelect(utxoListFormatted, targets, feePerByte);

      console.log('calculated transaction fee: ' + (fee ? fee : defaultFee))

      if (!outputs) {
        console.log('tx fee is too great to deduct from wallet, subtracting from tx amount instead')
        console.log('readjusting transaction amount...')
        amountSubmitted = value
        value = value.minus(BigNumber(fee))
        targets[0].value = value.toNumber()
        console.log('readjusted transaction amount: ' + targets[0].value)
        feeTakenFromAmount = true
        
        let secondRun = coinSelect(utxoListFormatted, targets, feePerByte);
        inputs = secondRun.inputs
        outputs = secondRun.outputs
        fee = secondRun.fee

        console.log('readjusted transaction fee: ' + fee)
      }

      if (!outputs) {
        throw new Error(
          "Insufficient funds. Failed to calculate acceptable transaction amount with fee of " +
            satsToCoins(BigNumber(fee ? fee : defaultFee)) +
            "."
        );
      }

      console.log('transaction calculated inputs =>')
      console.log(inputs)
      console.log('transaction calculated outputs =>')
      console.log(outputs)

      if (!fee) {
        console.log('no coinselect calculated fee entered, adjusting outputs for default fee =>')
        console.log(outputs)
        outputs[0].value = BigNumber(outputs[0].value).minus(defaultFee).toNumber();
      }

      let _change = 0;

      if (outputs &&
          outputs.length === 2) {
        _change = outputs[1].value;
      }

      // check if any outputs are unverified
      if (inputs &&
          inputs.length) {
        for (let i = 0; i < inputs.length; i++) {
          //TODO: Warnings for both txid verification and merkle verification
          if (!inputs[i].verifiedMerkle) {
            utxoVerified = false;
            break;
          }
        }

        for (let i = 0; i < inputs.length; i++) {
          if (Number(inputs[i].interestSats) > interestClaimThreshold) {
            totalInterest += Number(inputs[i].interestSats);
          }
        }
      }

      if (value.isGreaterThan(_maxSpendBalance)) {
        const successObj = {
          err: true,
          result: `Spend value is too large. Max available amount is ${satsToCoins(_maxSpendBalance).toString()}.` + 
          (unshieldedFunds.isGreaterThan(BigNumber(0)) ? `\n\nThis is most likely due to the fact that you have ${satsToCoins(unshieldedFunds).toString()} ${coinObj.id}
          in unshielded funds received from mining in your wallet. Please unshield through a native client prior to sending through Verus Mobile` : null),
        };

        resolve(successObj);
      } else {
        // account for KMD interest
        if ((network.coin === 'komodo' || network.coin === 'kmd') &&
            totalInterest > 0) {
          // account for extra vout
          // const _feeOverhead = outputs.length === 1 ? estimateTxSize(0, 1) * feeRate : 0;
          const _feeOverhead = 0;

          if (__DEV__) {
            console.log(`max interest to claim ${totalInterest} (${totalInterest * 0.00000001})`);
            console.log(`estimated fee overhead ${_feeOverhead}`);
            console.log(`current change amount ${_change} (${_change * 0.00000001}), boosted change amount ${_change + (totalInterest - _feeOverhead)} (${(_change + (totalInterest - _feeOverhead)) * 0.00000001})`);
          }
          
          if (_maxSpendBalance.isEqualTo(value)) {
            _change = Math.abs(totalInterest) - _change - _feeOverhead;

            if (outputAddress === changeAddress) {
              value = value.plus(BigNumber(_change));
              _change = 0;
              if (__DEV__) {
                console.log(`send to self ${outputAddress} = ${changeAddress}`);
                console.log(`send to self old val ${value}, new val ${value + _change}`);
              }
            }
          } else {
            _change = _change + (Math.abs(totalInterest) - _feeOverhead);
          }
        }

        if (!inputs &&
            !outputs) {
          const successObj = {
            err: true,
            result: 'Can\'t find best fit utxo. Try lower amount.',
          };

          resolve(successObj);
        } else {
          let vinSum = 0;

          for (let i = 0; i < inputs.length; i++) {
            vinSum += inputs[i].value;
          }

          const _estimatedFee = vinSum - outputs[0].value - _change;

          console.log(`vin sum ${vinSum} (${vinSum * 0.00000001})`);
          console.log(`estimatedFee ${_estimatedFee} (${_estimatedFee * 0.00000001})`);

          let _rawtx;

          _rawtx = buildSignedTx(
            outputAddress,
            changeAddress,
            electrumKey,
            network,
            inputs,
            _change,
            value.toNumber()
          );

          const successObj = {
            err: false,
            result: {
              fee: btcFees
                ? satsToCoins(BigNumber(fee)).toString()
                : satsToCoins(BigNumber(_estimatedFee)).toString(),
              value: satsToCoins(value).toString(),
              toAddress: outputAddress,
              fromAddress: changeAddress,
              amountSubmitted: satsToCoins(amountSubmitted).toString(),
              memo: null,
              params: {
                utxoSet: inputs,
                change: _change,
                inputs,
                outputs,
                feeTakenFromAmount,
                network,
                rawtx: _rawtx,
                utxoVerified,
                unshieldedFunds,
              },
            },
          };

          resolve(successObj);
        }
      }
    } else {
      resolve ({
        err: true,
        result: `No spendable funds found.` + 
        (unshieldedFunds.isGreaterThan(BigNumber(0)) ? `\n\nThis is most likely due to the fact that you have ${satsToCoins(unshieldedFunds).toString()} ${coinObj.id}
        in unshielded funds received from mining in your wallet. Please unshield through a native client prior to sending through Verus Mobile` : null),
      });
    }
    })
    .catch((e) => {
      reject(e)
    })
  });
}

export const sendRawTx = (coinObj, activeUser, outputAddress, value, params) => {
  const { defaultFee, network, verifyMerkle, verifyTxid } = params

  console.log("Value to send raw tx: " + value)
  return new Promise((resolve, reject) => {
    txPreflight(coinObj, activeUser, outputAddress, value, { defaultFee, network, verifyMerkle, verifyTxid })
    .then((resObj) => {
      if (resObj.err) {
        console.log(resObj)
        throw (resObj)
      } else {
        return pushTx(coinObj, resObj.result.params.rawtx)
      }
    })
    .then((resObj) => {
      if (resObj.result.code) {
        console.log(resObj)
        throw ({
          err: true,
          result: resObj.result.result.message
        })
      } else {
        console.log("Transaction sent succesfully")
        console.log(resObj)
        resolve(resObj)
      }
    })
    .catch((err) => {
      console.log(err)
      resolve(err)
    })
  });
}