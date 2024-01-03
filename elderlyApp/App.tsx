import { Platform, View } from 'react-native';
import MainMenu from './src/features/main_menu/actions';
import Credentials from './src/features/list_credentials/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './src/features/settings_interface/actions';
import FrequentQuestions from './src/features/list_questions/actions';
import Generator from './src/features/password_generator/actions';
import PasswordHistory from './src/features/password_history/actions';
import React, { useEffect, useState } from 'react';
import { initDb } from './src/database';
import FlashMessage from 'react-native-flash-message';
import Caregivers from './src/features/list_caregivers/actions';
import { changeKey, initFirestore } from './src/firebase/firestore/funcionalities';
import { cleanKeychain, getValueFor, initKeychain } from './src/keychain';
import { AddCredencial } from './src/features/add_credentials/actions';
import { initSSS } from './src/algorithms/sss/sss';
import CredencialPage from './src/features/credential_interface/actions';
import LoginPage from './src/features/login_interface/actions';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import PermissionsPage from './src/features/permissions_interface/actions';
import { LoginProvider, useLogin } from './src/features/login_interface/actions/session';
import { elderlySSSKey } from './src/keychain/constants';

export type RootStackParamList = {
  Home: undefined
  Credentials: undefined
  AddCredential: undefined
  Settings: undefined
  PasswordHistory: undefined
  FrequentQuestions: undefined
  Caregivers: undefined
  Generator: undefined
  CredentialPage: { id: string, platform: string, username: string, password: string }
  LoginPage: undefined
  Permissions: { platform: string }
};

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator<RootStackParamList>()

const im_testing = false

function InsideLayout() {
  const { userId, userShared, setShared } = useLogin()
  
  useEffect(() => {
    if(im_testing) {
      cleanKeychain(userId)
    } else {
      initSSS(userId)
      .then((shared) => setShared(shared))
      .then(() => initDb())
      .then(() => initFirestore(userId))
      .then(() => changeKey(userId))
    }
  }, [])

  return (
    <InsideStack.Navigator initialRouteName="Home">
      <InsideStack.Screen name="Home" component={MainMenu} options={{title: "Home", headerShown:false}}/>
      <InsideStack.Screen name="Credentials" component={Credentials} options={{title: "Credencials", headerShown:false}}/>
      <InsideStack.Screen name="AddCredential" component={AddCredencial} options={{title: "AddCredencial", headerShown:false}}/>
      <InsideStack.Screen name="Settings" component={Settings} options={{title: "Settings", headerShown:false}}/>
      <InsideStack.Screen name="Generator" component={Generator} options={{title: "Generator", headerShown:false}}/>
      <InsideStack.Screen name="PasswordHistory" component={PasswordHistory} options={{title: "Password history", headerShown:false}}/>
      <InsideStack.Screen name="FrequentQuestions" component={FrequentQuestions} options={{title: "Frequent Questions", headerShown:false}}/>
      <InsideStack.Screen name="Caregivers" component={Caregivers} options={{title: "Caregivers", headerShown:false}}/>
      <InsideStack.Screen name="CredentialPage" component={CredencialPage} options={{title: "CredencialPage", headerShown:false}}/>
      <InsideStack.Screen name="Permissions" component={PermissionsPage} options={{title: "PermissionsPage", headerShown:false}}/>
    </InsideStack.Navigator>
  )
}

function Inicialization() {

  const [user, setUser] = useState<User | null>(null)
  const { setUserId, setUserEmail, userId } = useLogin()

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      //console.log("User: " + user)
      //console.log("UserId: " + userId)
      if(userId) {
        setUser(user)
      }else if(user != null && user.email) {
        initKeychain(user.uid, user.email)
        setUserId(user.uid)
        setUserEmail(user.email)
        setUser(user)
      }
    })
  }, [user])

  return (
      <NavigationContainer>
        <View style={{flex: 0.06}}/>
        <Stack.Navigator initialRouteName="LoginPage">
          {user != null && userId != null ?
          <Stack.Screen name="Inside" component={InsideLayout} options={{title: "Inside", headerShown:false}}  />
          :
          <>
            <Stack.Screen name="LoginPage" component={LoginPage} options={{title: "LoginPage", headerShown:false}}/>
            <InsideStack.Screen name="Home" component={MainMenu} options={{title: "Home", headerShown:false}}/>
          </>
          }
        </Stack.Navigator>
        <FlashMessage/>
      </NavigationContainer>
  );
}

export default function App() {

  return (
    <LoginProvider>
      <Inicialization/>
    </LoginProvider>
  )
}