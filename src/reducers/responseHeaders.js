/*
  The ledger reducer stores the latest headers (non-ledger information)
  made by api calls. This data is directly assocated with the data in the
  ledger reducer and can be used to provide context to certain ledger information.
*/

import {
  SET_BALANCES,
  SET_RATES,
  SET_TRANSACTIONS,
  SIGN_OUT,
  SET_INFO
} from '../utils/constants/storeType'
import {
  ELECTRUM,
  DLIGHT,
  GENERAL,
  CHANNELS_OBJECT_TEMPLATE
} from "../utils/constants/intervalConstants";

export const responseHeaders = (state = {
  balances: CHANNELS_OBJECT_TEMPLATE,
  transactions: CHANNELS_OBJECT_TEMPLATE,
  rates: CHANNELS_OBJECT_TEMPLATE,
  info: CHANNELS_OBJECT_TEMPLATE,
}, action) => {
  const { chainTicker, header, channel } = action.payload || {}

  switch (action.type) {
    case SET_BALANCES:
      return {
        ...state,
        balances: {
          ...state.balances,
          [channel]: { ...state.balances[channel], [chainTicker]: header }
        }
      };
    case SET_INFO:
      return {
        ...state,
        info: {
          ...state.info,
          [channel]: { ...state.info[channel], [chainTicker]: header }
        }
      };
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [channel]: { ...state.transactions[channel], [chainTicker]: header }
        }
      };
    case SET_RATES:
      return {
        ...state,
        rates: {
          ...state.rates,
          [channel]: { ...state.rates[channel], [chainTicker]: header }
        }
      };
    case SIGN_OUT:
      return {
        ...state,
        balances: CHANNELS_OBJECT_TEMPLATE,
        transactions: CHANNELS_OBJECT_TEMPLATE,
        rates: CHANNELS_OBJECT_TEMPLATE,
        info: CHANNELS_OBJECT_TEMPLATE,
      };
    default:
      return state;
  }
}