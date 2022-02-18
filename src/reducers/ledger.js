/*
  The ledger reducer generally conatains coin information fetched from electrum
  calls and wallet information. The needsupdate booleans are to be set to true when the 
  program assumes some element of the ledger has changed and needs to be re-fetched, 
  and set to false again when that componenet updates.
*/

import { namesList } from '../utils/CoinData/CoinData'
//TODO: Change this to get coin names from activeCoinForUser
//so that when people add custom coins they also get told to 
//update

import {
  SET_BALANCES,
  SET_RATES,
  SET_TRANSACTIONS,
  SIGN_OUT_COMPLETE,
  SET_INFO,
  SET_CONVERSION_PATHS,
  SET_WITHDRAW_DESTINATIONS,
  SET_DEPOSIT_SOURCES,
  SET_PENDING_DEPOSITS
} from '../utils/constants/storeType'
import {
  CHANNELS_OBJECT_TEMPLATE
} from "../utils/constants/intervalConstants";

export const ledger = (state = {
  balances: CHANNELS_OBJECT_TEMPLATE,
  transactions: CHANNELS_OBJECT_TEMPLATE,
  rates: CHANNELS_OBJECT_TEMPLATE,
  info: CHANNELS_OBJECT_TEMPLATE,
  conversions: CHANNELS_OBJECT_TEMPLATE,
  withdrawDestinations: CHANNELS_OBJECT_TEMPLATE,
  depositSources: CHANNELS_OBJECT_TEMPLATE,
  pendingDeposits: CHANNELS_OBJECT_TEMPLATE
}, action) => {
  const { chainTicker, channel, body } = action.payload || {}

  switch (action.type) {
    case SET_BALANCES:
      return {
        ...state,
        balances: {
          ...state.balances,
          [channel]: { ...state.balances[channel], [chainTicker]: body },
        },
      };
    case SET_INFO:
      return {
        ...state,
        info: {
          ...state.info,
          [channel]: { ...state.info[channel], [chainTicker]: body },
        },
      };
    case SET_CONVERSION_PATHS:
      return {
        ...state,
        conversions: {
          ...state.conversions,
          [channel]: { ...state.conversions[channel], [chainTicker]: body },
        },
      };
    case SET_WITHDRAW_DESTINATIONS:
      return {
        ...state,
        withdrawDestinations: {
          ...state.withdrawDestinations,
          [channel]: { ...state.withdrawDestinations[channel], [chainTicker]: body },
        },
      };
    case SET_DEPOSIT_SOURCES:
      return {
        ...state,
        depositSources: {
          ...state.depositSources,
          [channel]: { ...state.depositSources[channel], [chainTicker]: body },
        },
      };
    case SET_PENDING_DEPOSITS:
      return {
        ...state,
        pendingDeposits: {
          ...state.pendingDeposits,
          [channel]: { ...state.pendingDeposits[channel], [chainTicker]: body },
        },
      };
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [channel]: { ...state.transactions[channel], [chainTicker]: body },
        },
      };
    case SET_RATES:
      return {
        ...state,
        rates: {
          ...state.rates,
          [channel]: { ...state.rates[channel], [chainTicker]: body },
        },
      };
    case SIGN_OUT_COMPLETE:
      return {
        ...state,
        balances: CHANNELS_OBJECT_TEMPLATE,
        transactions: CHANNELS_OBJECT_TEMPLATE,
        rates: CHANNELS_OBJECT_TEMPLATE,
        info: CHANNELS_OBJECT_TEMPLATE,
        conversions: CHANNELS_OBJECT_TEMPLATE,
        withdrawDestinations: CHANNELS_OBJECT_TEMPLATE,
        depositSources: CHANNELS_OBJECT_TEMPLATE,
        pendingDeposits: CHANNELS_OBJECT_TEMPLATE
      };
    /*case SET_INTERVAL_ID:
      return {
        ...state,
        updateIntervalID: action.updateIntervalID
      };*/
    default:
      return state;
  }
}