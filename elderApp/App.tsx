import { View } from 'react-native';
import MainMenu from './src/screens/main_menu/actions';
import Credentials from './src/screens/list_credentials/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './src/screens/settings_interface/actions';
import FrequentQuestions from './src/screens/list_questions/actions';
import Generator from './src/screens/password_generator/actions';
import PasswordHistory from './src/screens/password_history/actions';
import React, { useCallback, useEffect, useState } from 'react';
import { initDb } from './src/database';
import FlashMessage from 'react-native-flash-message';
import { Caregivers } from './src/screens/list_caregivers/actions';
import { changeFirestoreKey, initFirestore } from './src/firebase/firestore/functionalities';
import { initKeychain } from './src/keychain';
import { AddCredencial } from './src/screens/add_credentials/actions';
import { initSSS } from './src/algorithms/sss/sss';
import CredencialPage from './src/screens/credential_interface/actions';
import SignInPage from './src/screens/signin_interface/actions';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import { SessionProvider, useSessionInfo } from './src/firebase/authentication/session';
import SignUpPage from './src/screens/signup_interface/actions';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './src/screens/splash_screen/actions';
import * as SplashFunctions from 'expo-splash-screen';
import { createIdentity } from './src/e2e/identity/functions';
import * as Notifications from "expo-notifications";
import { executeKeyChangeIfTimeout } from './src/algorithms/sss/sssOperations';
import { flashTimeoutPromise } from './src/screens/splash_screen/actions/functions';

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()
//SplashFunctions.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function InsideLayout() {
  const { userId } = useSessionInfo()
  const [appIsReady, setAppIsReady] = useState(true)

  const keyVerification = async () => {
    if (!userId ||  userId === '') return
    await executeKeyChangeIfTimeout(userId)
  }

  useEffect(() => {
      flashTimeoutPromise(userId, setAppIsReady)
      .then(() => setAppIsReady(true))
      .then(() => keyVerification())
  }, [])

  const onLayoutRootView = useCallback(async () => { if (!appIsReady) await SplashFunctions.hideAsync() }, [appIsReady]);

  if (!appIsReady) return <SplashScreen test={onLayoutRootView} />
  return (
    <InsideStack.Navigator initialRouteName="MainMenu">
      <InsideStack.Screen name="MainMenu" component={MainMenu} options={{ title: "MainMenu", headerShown: false }} />
      <InsideStack.Screen name="Credentials" component={Credentials} options={{ title: "Credencials", headerShown: false }} />
      <InsideStack.Screen name="AddCredential" component={AddCredencial} options={{ title: "AddCredencial", headerShown: false }} />
      <InsideStack.Screen name="Settings" component={Settings} options={{ title: "Settings", headerShown: false }} />
      <InsideStack.Screen name="Generator" component={Generator} options={{ title: "Generator", headerShown: false }} />
      <InsideStack.Screen name="PasswordHistory" component={PasswordHistory} options={{ title: "Password history", headerShown: false }} />
      <InsideStack.Screen name="FrequentQuestions" component={FrequentQuestions} options={{ title: "Frequent Questions", headerShown: false }} />
      <InsideStack.Screen name="Caregivers" component={Caregivers} options={{ title: "Caregivers", headerShown: false }} />
      <InsideStack.Screen name="CredentialPage" component={CredencialPage} options={{ title: "CredencialPage", headerShown: false }} />
      <InsideStack.Screen name="LoginPage" component={SignInPage} options={{title: "LoginPage", headerShown:false}}/>
      <InsideStack.Screen name="SignupPage" component={SignUpPage} options={{title: "SignupPage", headerShown:false}}/>
    </InsideStack.Navigator>
  )
}

function Inicialization() {

  const [user, setUser] = useState<User | null>(null)
  const [notLoading, setNotLoading] = useState(false)
  const { setUserId, setUserEmail, setLocalDBKey, userId } = useSessionInfo()

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      const userEmail = user?.email
      if(userId) {
        setUser(user)
      }else if(userEmail && user.uid && !notLoading) {
        await initKeychain(user.uid, userEmail)
        .then((DBKey) => setLocalDBKey(DBKey))
        .then(() => {setUserId(user.uid); setUserEmail(userEmail); setUser(user)})
        .then(() => initSSS(user.uid))
        .then(() => initFirestore(user.uid))
        .then(() => initDb())
        .then(() => changeFirestoreKey(user.uid))
        .then(() => createIdentity(user.uid, userEmail))
        .then(() => console.log("User: ", user.uid))
        .then(() => setNotLoading(true))
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
          {user != null && userId != null && userId != '' ?
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
      <StatusBar/>
      <Inicialization/>
    </SessionProvider>
  )
}