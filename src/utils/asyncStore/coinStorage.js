import AsyncStorage from '@react-native-community/async-storage';
import { findCoinObj } from '../CoinData/CoinData';
// react-native's version of local storage

//Clear user from coin, or delete user from all if no coin specified
export const deleteUserFromCoin = (userID, coinID) => {
  return new Promise((resolve, reject) => {
    getActiveCoinList()
    .then((coinList) => {
      let newList = coinList.slice()
      for (let i = 0; i < newList.length; i++) {
        if (coinID === null || newList[i].id === coinID) {
          let userIndex = newList[i].users.findIndex(n => n === userID);

          if (userIndex > -1) {
            newList[i].users.splice(userIndex, 1);
          }
        }
      }

      return storeCoins(newList)
    })
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(err)
    })
  });
}

//Set storage to hold list of activated coins
export const storeCoins = (coins) => {
  let _coins = coins ? coins.slice() : []
  let _toStore = {coins: _coins}

  return new Promise((resolve, reject) => {
    AsyncStorage.setItem('activeCoins', JSON.stringify(_toStore))
      .then(() => {
        resolve(true);
      })
      .catch(err => reject(err));
  }) 
};

export const getActiveCoinList = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('activeCoins')
      .then(res => {
        if (!res) {
          let coinsList = {coins: []};
          resolve(coinsList.coins);
        }
        else {
          _res = JSON.parse(res);
          resolve(_res.coins);
        }
      })
      .catch(err => reject(err));
  });
};

export const updateActiveCoinList = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('activeCoins')
      .then((res) => {
        let coinList = []
        let newCoinList = []

        if (res) {
          coinList = JSON.parse(res).coins;
        }
        
        coinList = coinList.map((coin) => {
          const newCoinObj = findCoinObj(coin.id, "")
          
          if (coin.id !== 'K64') {
            newCoinList.push({...newCoinObj, users: coin.users})
          }
        })

        return storeCoins(newCoinList)
      })
      .then(() => {
        resolve(true)
      })
      .catch(err => reject(err));
  });
};