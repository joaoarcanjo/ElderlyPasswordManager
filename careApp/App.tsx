import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/screens/main_menu/actions';
import ElderlyListScreen from './src/screens/list_elderly/actions';
import { initDb } from './src/database';
import ChatPageTest from './src/screens/list_elderly/actions/indexTest';
import FlashMessage from "react-native-flash-message";
import ElderlyCredentials from './src/screens/elderly_credentials/actions';
import { AddCredencial } from './src/screens/add_credentials/actions';
import { SessionProvider, useSessionInfo } from './src/firebase/authentication/session';
import * as Notifications from "expo-notifications";
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import { getKeychainValueFor, initKeychain } from './src/keychain';
import SignInPage from './src/screens/signin_interface/actions';
import SignUpPage from './src/screens/signup_interface/actions';
import { createIdentity } from './src/e2e/identity/functions';
import CredencialPage from './src/screens/credential_interface/actions';
import Settings from './src/screens/settings_interface/actions';
import Credentials from './src/screens/list_credentials/actions';
import { initFirestore } from './src/firebase/firestore/functionalities';
import { caregiverName } from './src/keychain/constants';

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()

function InsideLayout() {
  const { userId, userEmail } = useSessionInfo()

  const initInsideLayout = async () => {
    await initFirestore(userId).then(() => initDb())
    await createIdentity(userEmail)
  }

  useEffect(() => {
    console.debug("#-> InsideLayout: useEffect called.")
    initInsideLayout()
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
    
      <InsideStack.Screen name="ChatTest" component={ChatPageTest} options={{ title: "ChatTest", headerShown: false }} />
    </InsideStack.Navigator>
  );
}


function Inicialization() {

  const [user, setUser] = useState<User | null>(null)
  const { setUserId, setUserEmail, setLocalDBKey, userId } = useSessionInfo()

  useEffect(() => {
    
    onAuthStateChanged(FIREBASE_AUTH, async (user: any) => {
      //console.log("User: " + user)
      //console.log("UserId: " + userId)
      if(userId) {
        setUser(user)
      }else if(user?.email) {
        initKeychain(user.uid, user.email).then(DBKey => setLocalDBKey(DBKey))
        setUserId(user.uid)
        setUserEmail(user.email)
        setUser(user)
      }

      let { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
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