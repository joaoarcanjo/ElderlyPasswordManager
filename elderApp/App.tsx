import { View } from 'react-native';
import MainMenu from './src/screens/main_menu/actions';
import Credentials from './src/screens/list_credentials/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './src/screens/settings_interface/actions';
import Generator from './src/screens/password_generator/actions';
import PasswordHistory from './src/screens/password_history/actions';
import React, { useEffect, useState } from 'react';
import { initDb } from './src/database';
import FlashMessage from 'react-native-flash-message';
import { Caregivers } from './src/screens/list_caregivers/actions';
import { initFirestore } from './src/firebase/firestore/functionalities';
import { initKeychain } from './src/keychain';
import { AddCredencial } from './src/screens/add_credentials/actions';
import FrequentQuestions from './src/screens/list_questions/actions';
import SignInPage from './src/screens/signin_interface/actions';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import { SessionProvider, useSessionInfo } from './src/firebase/authentication/session';
import SignUpPage from './src/screens/signup_interface/actions';
import { StatusBar } from 'expo-status-bar';
import { createIdentity } from './src/e2e/identity/functions';
import * as Notifications from "expo-notifications";
import { emptyValue, pageAddCredential, pageCaregivers, pageCredentialCard, pageCredentialLogin, pageCredentials, pageQuestions, pageGenerator, pageLogin, pageMainMenu, pagePasswordHistory, pageSettings, pageSignup } from './src/assets/constants/constants';
import CredencialLoginPage from './src/screens/credential_interface/actions/login';
import CredencialCardPage from './src/screens/credential_interface/actions/card';
import { initSSS } from './src/algorithms/shamirSecretSharing/sss';
import { executeKeyChangeIfTimeout } from './src/algorithms/shamirSecretSharing/sssOperations';

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function InsideLayout() {
  const { userId } = useSessionInfo()

  const keyVerification = async () => {
    if (!userId ||  userId === emptyValue) return
    await executeKeyChangeIfTimeout(userId)
  }

  useEffect(() => {keyVerification()}, [])

  return (
    <InsideStack.Navigator initialRouteName={pageMainMenu}>
      <InsideStack.Screen name={pageMainMenu} component={MainMenu} options={{ title: "MainMenu", headerShown: false }} />
      <InsideStack.Screen name={pageCredentials} component={Credentials} options={{ title: "Credencials", headerShown: false }} />
      <InsideStack.Screen name={pageAddCredential} component={AddCredencial} options={{ title: "AddCredencial", headerShown: false }} />
      <InsideStack.Screen name={pageSettings} component={Settings} options={{ title: "Settings", headerShown: false }} />
      <InsideStack.Screen name={pageGenerator} component={Generator} options={{ title: "Generator", headerShown: false }} />
      <InsideStack.Screen name={pagePasswordHistory} component={PasswordHistory} options={{ title: "Password history", headerShown: false }} />
      <InsideStack.Screen name={pageQuestions} component={FrequentQuestions} options={{ title: "Frequent Questions", headerShown: false }} />
      <InsideStack.Screen name={pageCaregivers} component={Caregivers} options={{ title: "Caregivers", headerShown: false }} />
      <InsideStack.Screen name={pageCredentialLogin} component={CredencialLoginPage} options={{ title: "CredencialLoginPage", headerShown: false }} />
      <InsideStack.Screen name={pageCredentialCard} component={CredencialCardPage} options={{ title: "CredencialCardPage", headerShown: false }} />
      <InsideStack.Screen name={pageLogin} component={SignInPage} options={{title: "LoginPage", headerShown:false}}/>
      <InsideStack.Screen name={pageSignup} component={SignUpPage} options={{title: "SignupPage", headerShown:false}}/>
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
        .then(() => initSSS(user.uid))
        .then(() => initDb(user.uid)).then((DBKey) => setLocalDBKey(DBKey))
        .then(() => initFirestore(user.uid))
        .then(() => createIdentity(user.uid, userEmail))
        .then(() => {setUserId(user.uid); setUserEmail(userEmail); setUser(user)})
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
          {user != null && userId != null && userId != emptyValue ?
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