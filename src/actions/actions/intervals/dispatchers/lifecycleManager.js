import { refreshCoinIntervals } from '../../../actionDispatchers'
import {
  PRE_DATA,
  SYNCING,
  POST_SYNC,
  API_GET_INFO,
  DLIGHT
} from "../../../../utils/constants/intervalConstants";
import { setCoinStatus } from '../../../actionCreators'
import { getCoinObj } from '../../../../utils/CoinData/CoinData';
import { clearAllCoinIntervals } from './IntervalCreator';

export const activateChainLifecycle = (chainTicker) => {  
  refreshCoinIntervals(chainTicker, {[API_GET_INFO]: {update_expired_oncomplete: getInfoOnComplete}})
}

export const clearChainLifecycle = (chainTicker) => {
  clearAllCoinIntervals(chainTicker)
}

export const getInfoOnComplete = (state, dispatch, chainTicker) => {
  const activeCoin = getCoinObj(state.coins.activeCoinsForUser, chainTicker)
  
  if (activeCoin == null) throw new Error(`${chainTicker} is not an active coin.`)

  const currentStatus = state.coins.status[chainTicker]
  const getInfoResult = state.ledger.info[chainTicker];
  const getInfoError = state.errors[API_GET_INFO][DLIGHT][chainTicker];
  const refresh = () =>
    refreshCoinIntervals(chainTicker, {
      [API_GET_INFO]: { update_expired_oncomplete: getInfoOnComplete }
    });

  if (getInfoError && getInfoError.error) return

  if (
    typeof getInfoResult !== "object" ||
    !getInfoResult.hasOwnProperty("blocks") ||
    (getInfoResult.hasOwnProperty("longestchain") &&
      getInfoResult.longestchain === 0)
  ) {
    if (currentStatus !== PRE_DATA) {
      dispatch(setCoinStatus(chainTicker, PRE_DATA));
      refresh();
    }
  } else if (
    getInfoResult.percent != null &&
    getInfoResult.percent < 100
  ) {
    if (currentStatus !== SYNCING) {
      dispatch(setCoinStatus(chainTicker, SYNCING));
      refresh();
    }
  } else {
    if (currentStatus !== POST_SYNC) {
      dispatch(setCoinStatus(chainTicker, POST_SYNC));
      refresh();
    }
  }
};