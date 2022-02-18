const bs58check = require('bs58check');

import { isKomodoCoin } from 'agama-wallet-lib/src/coin-helpers';
import electrumJSNetworks from 'agama-wallet-lib/src/bitcoinjs-networks';
import { decryptkey } from './seedCrypt';

import {
  wifToWif,
  seedToWif,
  seedToPriv
} from 'agama-wallet-lib/src/keys';
import { ETH, ERC20 } from './constants/intervalConstants';
import ethers from 'ethers';

export const makeKeyPair = (seed, coinID, channel) => {
  let isWif = false;
  let _seedToWif;
  let keyObj = {};

  try {
    bs58check.decode(seed);
    isWif = true;
  } catch (e) {}

  if (isWif) {
    _seedToWif = wifToWif(seed, isKomodoCoin(coinID) ? electrumJSNetworks.kmd : electrumJSNetworks[coinID.toLowerCase()]);
  } else {
    _seedToWif = seedToWif(seed, isKomodoCoin(coinID) ? electrumJSNetworks.kmd : electrumJSNetworks[coinID.toLowerCase()], true);
  }

  keyObj = {
    pubKey: _seedToWif.pubHex,
    privKey: channel === ETH || channel === ERC20 ? seedToPriv(_seedToWif.priv, 'eth') : _seedToWif.priv,
    addresses: [
      channel === ETH || channel === ERC20
        ? ethers.utils.computeAddress(Buffer.from(_seedToWif.pubHex, "hex"))
        : _seedToWif.pub,
    ],
  };

  return keyObj;
}

export const pairFromPwd = (password, encryptedKey, coinID) => {
  let seed = decryptkey(password, encryptedKey);

  return makeKeyPair(seed, coinID);
}
