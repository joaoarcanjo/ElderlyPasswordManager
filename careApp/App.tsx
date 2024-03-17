import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/screens/main_menu/actions';
import ElderlyListScreen from './src/screens/list_elderly/actions';
import { initDb } from './src/database';
import FlashMessage from "react-native-flash-message";
import ElderlyCredentials from './src/screens/elderly_credentials/actions';
import { AddCredencial } from './src/screens/add_credentials/actions';
import { SessionProvider, useSessionInfo } from './src/firebase/authentication/session';
import * as Notifications from "expo-notifications";
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import { initKeychain } from './src/keychain';
import SignInPage from './src/screens/signin_interface/actions';
import SignUpPage from './src/screens/signup_interface/actions';
import { createIdentity } from './src/e2e/identity/functions';
import CredencialPage from './src/screens/credential_interface/actions';
import Settings from './src/screens/settings_interface/actions';
import Credentials from './src/screens/list_credentials/actions';
import { initFirestore } from './src/firebase/firestore/functionalities';

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()

function InsideLayout() {

  useEffect(() => {
    console.debug("#-> InsideLayout: useEffect called.")
  }, [])

  return (
    <InsideStack.Navigator initialRouteName="MainMenu">
      <InsideStack.Screen name="MainMenu" component={MainMenu} options={{ title: "MainMenu", headerShown: false }} />
      <InsideStack.Screen name="Credentials" component={Credentials} options={{ title: "Credencials", headerShown: false }} />
      <InsideStack.Screen name="ElderlyList" component={ElderlyListScreen} options={{ title: "listElderly", headerShown: false }} />
      <InsideStack.Screen name="ElderlyCredentials" component={ElderlyCredentials} options={{ title: "ElderlyCredencials", headerShown: false }} />
      <InsideStack.Screen name="AddCredential" component={AddCredencial} options={{ title: "AddCredential", headerShown: false }} />
      <InsideStack.Screen name="Settings" component={Settings} options={{ title: "Settings", headerShown: false }} />
      <InsideStack.Screen name="CredentialPage" component={CredencialPage} options={{ title: "CredencialPage", headerShown: false }} />
    </InsideStack.Navigator>
  );
}


function Inicialization() {

  const [user, setUser] = useState<User | null>(null)
  const { setUserId, setUserEmail, setLocalDBKey, userId } = useSessionInfo()

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      const userEmail = user?.email
      if(userId) {
        setUser(user)
      }else if(userEmail && user.uid) {
        await initKeychain(user.uid, user.email)
        .then((DBKey) => setLocalDBKey(DBKey))
        .then(() => { setUserId(user.uid); setUserEmail(userEmail); setUser(user)})
        .then(() => initFirestore(user.uid))
        .then(() => initDb()) 
      }

      let { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        //TODO: do an alert
      }
    })
  }, [user])

  return (
      <NavigationContainer>
        <View style={{flex: 0.06}}/>
        <Stack.Navigator initialRouteName="LoginPage">
          {user != null && userId != null ?
          <Stack.Screen name="InsideLayout" component={InsideLayout} options={{title: "InsideLayout", headerShown:false}}/>:
          <>
            <Stack.Screen name="LoginPage" component={SignInPage} options={{title: "LoginPage", headerShown:false}}/>
            <Stack.Screen name="SignupPage" component={SignUpPage} options={{title: "SignupPage", headerShown:false}}/>
          </>
          }
        </Stack.Navigator>
        <FlashMessage/>
      </NavigationContainer>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <StatusBar hidden />
      <Inicialization/>
    </SessionProvider>
  )
}