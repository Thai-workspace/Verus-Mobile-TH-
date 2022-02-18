import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { coins } from './coins';
import { ledger } from './ledger';
import { settings } from './settings';
import { personal } from './personal';
import { services } from './services';
import { electrum } from './cache/electrum';
import { headers } from './cache/headers';
import { ethtxreceipts } from './cache/ethtxreceipts';
import { customCoins } from './gui/customCoins';
import { buySellCrypto } from './gui/buySellCrypto';
import { coinMenus } from './gui/coinMenus';
import { paymentMethods } from './paymentMethods';
import { updates } from './updates';
import { responseHeaders } from './responseHeaders';
import { errors } from './errors';
import { coinOverview } from './gui/coinOverview';
import { channelStore_dlight_private } from './channelStores/dlight';
import { channelStore_eth } from './channelStores/eth';
import { channelStore_erc20 } from './channelStores/erc20';
import { channelStore_electrum } from './channelStores/electrum';
import { channelStore_general } from './channelStores/general';
import { channelStore_wyre_service } from './channelStores/wyre';
import { alert } from './alert'
import { modal } from './modal'
import { keyboard } from './keyboard'
import identity from './identity';
import { sendModal } from './sendModal';
import { secureLoading } from './secureLoading';

export default combineReducers({
  authentication,
  coins,
  ledger,
  settings,
  electrum,
  headers,
  customCoins,
  buySellCrypto,
  paymentMethods,
  updates,
  errors,
  responseHeaders,
  coinOverview,
  identity,
  channelStore_dlight_private,
  channelStore_eth,
  channelStore_electrum,
  channelStore_erc20,
  channelStore_general,
  channelStore_wyre_service,
  ethtxreceipts,
  coinMenus,
  alert,
  modal,
  keyboard,
  personal,
  services,
  sendModal,
  secureLoading
});
