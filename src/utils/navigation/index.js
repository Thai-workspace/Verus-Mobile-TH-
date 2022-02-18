import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/compat';
import {
  StyleSheet, TouchableOpacity, Dimensions, Text, Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';

import IconVector from 'react-native-vector-icons/Ionicons';
import Colors from '../../globals/colors';
import SideMenu from '../../containers/SideMenu/SideMenu';

import Login from '../../containers/Login/Login';
import Home from '../../containers/Home/Home';
import AddCoin from '../../containers/AddCoin/AddCoin';
import SignUp from '../../containers/SignUp/SignUp';
import CoinDetails from '../../containers/CoinDetails/CoinDetails';
import LoadingScreen from '../../containers/LoadingScreen/LoadingScreen';
import ConfirmSend from '../../containers/ConfirmSend/ConfirmSend';
import SendResult from '../../containers/Coin/SendCoin/SendResult/SendResult';
import CoinMenus from '../../containers/Coin/CoinMenus';
import VerusPay from '../../containers/VerusPay/VerusPay';
import SettingsMenus from '../../containers/Settings/SettingsMenus';
import ProfileInfo from '../../containers/Settings/ProfileSettings/ProfileInfo/ProfileInfo';
import ResetPwd from '../../containers/Settings/ProfileSettings/ResetPwd/ResetPwd';
import DisplaySeed from '../../containers/Settings/ProfileSettings/DisplaySeed/DisplaySeed';
import RecoverSeed from '../../containers/Settings/ProfileSettings/RecoverSeed/RecoverSeed';
import DeleteProfile from '../../containers/Settings/ProfileSettings/DeleteProfile/DeleteProfile';
import SecureLoading from '../../containers/SecureLoading/SecureLoading';
import CustomChainMenus from '../../containers/CustomChains/CustomChainMenus';
import GeneralWalletSettings from '../../containers/Settings/WalletSettings/GeneralWalletSettings/GeneralWalletSettings';
import CoinSettings from '../../containers/Settings/WalletSettings/CoinSettings/CoinSettings';
import BuySellCryptoMenus from '../../containers/BuySellCrypto/BuySellCryptoMenus';
import SelectPaymentMethod from '../../containers/BuySellCrypto/PaymentMethod/SelectPaymentMethod/SelectPaymentMethod';
import ManageWyreAccount from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyreAccount';
import ManageWyreEmail from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyreEmail';
import ManageWyreCellphone from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyreCellphone';
import ManageWyreDocuments from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyreDocuments';
import ManageWyrePaymentMethod from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyrePaymentMethod';
import ManageWyrePersonalDetails from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyrePersonalDetails';
import ManageWyreProofOfAddress from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyreProofOfAddress';
import ManageWyreAddress from '../../containers/BuySellCrypto/PaymentMethod/ManageWyreAccount/ManageWyreAddress';
import SendTransaction from '../../containers/BuySellCrypto/PaymentMethod/SendTransaction/SendTransaction';
import Identity from '../../containers/Identity';
import ScanBadge from '../../containers/Identity/Home/ScanBadge';
import PersonalInfo from '../../containers/Identity/PersonalInfo';
import ClaimDetails from '../../containers/Identity/PersonalInfo/ClaimDetails';
import ClaimCategory from '../../containers/Identity/PersonalInfo/ClaimCategoryDetails';
import AttestationDetails from '../../containers/Identity/Home/AttestationDetails';
import ClaimManager from '../../containers/Identity/PersonalInfo/ClaimManager';
import MoveIntoCategory from '../../containers/Identity/PersonalInfo/ClaimManager/MoveIntoCategory';
import AddIdentity from '../../containers/Identity/AddIdentity';

const WALLET = 'wallet';

const MainStack = createStackNavigator()
const SignedOutStack = createStackNavigator()
const SignedOutNoKeyStack = createStackNavigator()
const LoadingStack = createStackNavigator()
const RootStack = createDrawerNavigator()

const styles = StyleSheet.create({
  header_title_noBack: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    height: 55,
    textAlign: 'center',
    fontSize: 18,
    color: '#E9F1F7',
    paddingTop: 15,
    width: Dimensions.get('window').width, // width of both buttons + no left-right padding
  },

  header_title_back: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    height: 55,
    textAlign: 'right',
    fontSize: 18,
    color: '#E9F1F7',
    paddingTop: 15,
    width: Dimensions.get('window').width - 110, // width of both buttons + no left-right padding
  },

  menuButton: {
    marginRight: 15,
  },

  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  goBackBtnText: {
    color: 'white',
    paddingLeft: 10,
    fontSize: 18,
  },

});

function MainStackScreens() {
  return (
    <MainStack.Navigator
      headerMode="screen"
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: Colors.primaryColor,
        },
        headerTitleStyle: {
          fontFamily: "Avenir-Black",
          fontWeight: "normal",
          fontSize: 22,
          color: Colors.secondaryColor,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={styles.menuButton}
          >
            <Icon name="menu" size={35} color={Colors.secondaryColor} />
          </TouchableOpacity>
        ),
        gesturesEnabled: false,
        headerTintColor: Colors.secondaryColor,
      })}
    >
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Home",
          headerLeft: () => null,
        }}
      />

      <MainStack.Screen
        name="AddCoin"
        component={AddCoin}
        options={{
          title: "Add Coin",
        }}
      />

      <MainStack.Screen
        name="CoinDetails"
        component={CoinDetails}
        options={{
          title: "Details",
        }}
      />

      <MainStack.Screen
        name="ClaimManager"
        component={ClaimManager}
        options={{
          title: "Claim Manager",
        }}
      />

      <MainStack.Screen
        name="MoveIntoCategory"
        component={MoveIntoCategory}
        options={({ navigation, route }) => ({
          title: "Categories",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                route.params.clearClaims();
                navigation.goBack();
              }}
              style={styles.goBackBtn}
            >
              <IconVector
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                size={35}
                color="white"
                style={{ paddingLeft: 8 }}
              />
              <Text style={styles.goBackBtnText}>Back</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <MainStack.Screen
        name="AttestationDetails"
        component={AttestationDetails}
        options={({ route }) => ({
          title: route.params.id,
        })}
      />

      <MainStack.Screen
        name="Identity"
        component={Identity}
        options={({ route }) => ({
          title: route.params.selectedScreen,
        })}
      />

      <MainStack.Screen
        name="AddIdentity"
        component={AddIdentity}
        options={{
          title: "Add Identity",
        }}
      />

      <MainStack.Screen
        name="ClaimDetails"
        component={ClaimDetails}
        options={({ route }) => ({
          title: route.params.claimName,
        })}
      />

      <MainStack.Screen
        name="ClaimCategory"
        component={ClaimCategory}
        options={({ route }) => ({
          title: route.params.claimCategoryName,
        })}
      />

      <MainStack.Screen
        name="ScanBadge"
        component={ScanBadge}
        options={{
          title: "Verify Attestation",
        }}
      />

      <MainStack.Screen
        name="ConfirmSend"
        component={ConfirmSend}
        options={{
          title: "Confirm Send",
        }}
      />

      <MainStack.Screen
        name="SendResult"
        component={SendResult}
        options={{
          title: "Send Result",
          headerLeft: () => null,
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="DisplaySeed"
        component={DisplaySeed}
        options={{
          title: "Seed",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen name="CoinMenus" component={CoinMenus} />

      <MainStack.Screen name="SettingsMenus" component={SettingsMenus} />

      <MainStack.Screen
        name="VerusPay"
        component={VerusPay}
        options={{
          title: "VerusPay",
        }}
      />

      <MainStack.Screen
        name="ProfileInfo"
        component={ProfileInfo}
        options={{
          title: "Info",
        }}
      />

      <MainStack.Screen
        name="ResetPwd"
        component={ResetPwd}
        options={{
          title: "Reset",
        }}
      />

      <MainStack.Screen
        name="RecoverSeed"
        component={RecoverSeed}
        options={{
          title: "Recover",
        }}
      />

      <MainStack.Screen
        name="GeneralWalletSettings"
        component={GeneralWalletSettings}
        options={{
          title: "General Wallet Settings",
        }}
      />

      <MainStack.Screen name="CoinSettings" component={CoinSettings} />

      <MainStack.Screen
        name="DeleteProfile"
        component={DeleteProfile}
        options={{
          title: "Delete",
        }}
      />

      <MainStack.Screen
        name="SecureLoading"
        component={SecureLoading}
        options={{
          title: "Loading",
          headerRight: () => null,
          headerLeft: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="CustomChainMenus"
        component={CustomChainMenus}
      />

      <MainStack.Screen
        name="BuySellCryptoMenus"
        component={BuySellCryptoMenus}
      />

      <MainStack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
        options={{
          title: "Select Payment Method",
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyreAccount"
        component={ManageWyreAccount}
        options={{
          title: "Manage Wyre Account",
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyreEmail"
        component={ManageWyreEmail}
        options={{
          title: "Manage Wyre Email",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyreCellphone"
        component={ManageWyreCellphone}
        options={{
          title: "Manage Wyre Cellphone",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyreDocuments"
        component={ManageWyreDocuments}
        options={{
          title: "Upload Documents",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyrePaymentMethod"
        component={ManageWyrePaymentMethod}
        options={{
          title: "Manage Payment Method",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyrePersonalDetails"
        component={ManageWyrePersonalDetails}
        options={{
          title: "Upload Personal Details",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyreProofOfAddress"
        component={ManageWyreProofOfAddress}
        options={{
          title: "Upload Proof of Address",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="ManageWyreAddress"
        component={ManageWyreAddress}
        options={{
          title: "Manage Wyre Address",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />

      <MainStack.Screen
        name="SendTransaction"
        component={SendTransaction}
        options={{
          title: "Confirm transaction",
          headerRight: () => null,
          drawerLockMode: "locked-closed",
        }}
      />
    </MainStack.Navigator>
  );
}

function SignedOutStackScreens() {
  return (
    <SignedOutStack.Navigator>
      <SignedOutStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <SignedOutStack.Screen
        name="SignIn"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />

      <SignedOutStack.Screen
        name="RecoverSeed"
        component={RecoverSeed}
        options={{
          title: 'Recover',
        }}
      />

      <SignedOutStack.Screen
        name="DisplaySeed"
        component={DisplaySeed}
        options={{
          title: 'Seed',
        }}
      />

      <SignedOutStack.Screen
        name="DeleteProfile"
        component={DeleteProfile}
        options={{
          title: 'Delete',
        }}
      />

      <SignedOutStack.Screen
        name="SecureLoading"
        component={SecureLoading}
        options={{
          title: 'Loading',
          headerRight: () => null,
          headerLeft: () => null,
          drawerLockMode: 'locked-closed',
        }}
      />
    </SignedOutStack.Navigator>
  );
}

function SignedOutNoKeyStackScreens() {
  return (
    <SignedOutNoKeyStack.Navigator>
      <SignedOutStack.Screen
        name="SignIn"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
    </SignedOutNoKeyStack.Navigator>
  );
}

function LoadingStackScreens() {
  return (
    <LoadingStack.Navigator>
      <LoadingStack.Screen
        name="Splash"
        component={LoadingScreen}
        options={{
          headerShown: false,
        }}
      />
    </LoadingStack.Navigator>
  );
}

export default function RootStackScreens(hasAccount, loading, signedIn) {
  return (
    <RootStack.Navigator
      drawerWidth={250}
      drawerPosition="right"
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={{
        mode: "modal",
      }}
    >
      {loading ? (
        <RootStack.Screen
          name="LoadingStack"
          component={LoadingStackScreens}
          options={{
            gesturesEnabled: false,
            drawerLockMode: "locked-closed",
          }}
        />
      ) : hasAccount ? (
        signedIn ? (
          <RootStack.Screen
            name="SignedIn"
            component={MainStackScreens}
            options={{
              gesturesEnabled: false,
            }}
          />
        ) : (
          <RootStack.Screen
            name="SignedOutStack"
            component={SignedOutStackScreens}
            options={{
              gesturesEnabled: false,
              drawerLockMode: "locked-closed",
              headerRight: () => null,
            }}
          />
        )
      ) : (
        <RootStack.Screen
          name="SignedOutNoKeyStack"
          component={SignedOutNoKeyStackScreens}
          options={{
            gesturesEnabled: false,
            drawerLockMode: "locked-closed",
          }}
        />
      )}
    </RootStack.Navigator>
  );
}
