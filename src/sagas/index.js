import { all, spawn } from 'redux-saga/effects';

import identitySaga from './identity'
import transactionsSaga from './transactions';
import erc20Saga from './channels/erc20';
import ethSaga from './channels/eth';
import electrumSaga from './channels/electrum';
import dlightSaga from './channels/dlight';
import generalSaga from './channels/general';
import wyreCoinSaga from './channels/wyre';
import authenticationSaga from './authentication'

import {
  ENABLE_VERUS_IDENTITIES,
  ENABLE_DLIGHT,
  ENABLE_ERC20,
  ENABLE_ELECTRUM,
  ENABLE_ETH,
  ENABLE_GENERAL,
  ENABLE_WYRE_COIN
} from "../../env/index";

const generateSagas = () => {
  let sagas = [authenticationSaga]

  if (ENABLE_VERUS_IDENTITIES) sagas.push(identitySaga)

  if (ENABLE_DLIGHT) {
    sagas.push(transactionsSaga)
    sagas.push(dlightSaga)
  }

  if (ENABLE_ERC20) sagas.push(erc20Saga)
  if (ENABLE_ELECTRUM) sagas.push(electrumSaga)
  if (ENABLE_ETH) sagas.push(ethSaga)
  if (ENABLE_GENERAL) sagas.push(generalSaga)
  if (ENABLE_WYRE_COIN) sagas.push(wyreCoinSaga)

  return sagas
}

const sagas = generateSagas()

export default function*() {
  yield all(sagas.map((saga) => spawn(saga)));
}
