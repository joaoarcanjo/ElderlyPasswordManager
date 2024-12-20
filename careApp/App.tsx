import { Alert, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/screens/main_menu/actions';
import ElderlyListScreen from './src/screens/list_elderly/actions';
import { dbSQL, initDb } from './src/database';
import FlashMessage from "react-native-flash-message";
import { AddCredencial } from './src/screens/add_credentials/actions';
import { SessionProvider, useSessionInfo } from './src/context/session';
import * as Notifications from "expo-notifications";
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import { getKeychainValueFor, initKeychain, saveKeychainValue } from './src/keychain';
import SignInPage from './src/screens/signin_interface/actions';
import Settings from './src/screens/settings_interface/actions';
import Credentials from './src/screens/list_credentials/actions/personalCredentials';
import { initFirestore } from './src/firebase/firestore/functionalities';
import { createIdentity } from './src/e2e/identity/functions';
import { emptyValue, pageAddCredential, pageCredentialCard, pageCredentialLogin, pageCredentials, pageElderlyCredentials, pageElderlyList, pageQuestions, pageGenerator, pageLogin, pageMainMenu, pagePasswordHistory, pageSettings, pageSignup } from './src/assets/constants/constants';
import CredencialCardPage from './src/screens/credential_interface/actions/card';
import CredencialLoginPage from './src/screens/credential_interface/actions/login';
import SignUpPage from './src/screens/signup_interface/actions';
import ElderlyCredentials from './src/screens/list_credentials/actions/elderlyCredentials';
import FrequentQuestions from './src/screens/list_questions/actions';
import Generator from './src/screens/password_generator/actions';
import PasswordHistory from './src/screens/password_history/actions';
import { caregiverFireKey } from './src/keychain/constants';

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()

function InsideLayout() {

  return (
    <InsideStack.Navigator initialRouteName={pageMainMenu}>
      <InsideStack.Screen name={pageMainMenu} component={MainMenu} options={{ title: "MainMenu", headerShown: false }} />
      <InsideStack.Screen name={pageCredentials} component={Credentials} options={{ title: "Credentials", headerShown: false }} />
      <InsideStack.Screen name={pageElderlyList} component={ElderlyListScreen} options={{ title: "listElderly", headerShown: false }} />
      <InsideStack.Screen name={pageElderlyCredentials} component={ElderlyCredentials} options={{ title: "ElderlyCredentials", headerShown: false }} />
      <InsideStack.Screen name={pageAddCredential} component={AddCredencial} options={{ title: "AddCredential", headerShown: false }} />
      <InsideStack.Screen name={pageSettings} component={Settings} options={{ title: "Settings", headerShown: false }} />
      <InsideStack.Screen name={pageCredentialLogin} component={CredencialLoginPage} options={{ title: "CredencialLoginPage", headerShown: false }} />
      <InsideStack.Screen name={pageCredentialCard} component={CredencialCardPage} options={{ title: "CredencialCardPage", headerShown: false }} />
      <InsideStack.Screen name={pageGenerator} component={Generator} options={{ title: "Generator", headerShown: false }} />
      <InsideStack.Screen name={pagePasswordHistory} component={PasswordHistory} options={{ title: "Password history", headerShown: false }} />
      <InsideStack.Screen name={pageQuestions} component={FrequentQuestions} options={{ title: "Frequent Questions", headerShown: false }} />
    </InsideStack.Navigator>
  )
}

function Inicialization() {

  const [user, setUser] = useState<User | null>(null)
  const { setUserId, setUserEmail, setLocalDBKey, userId } = useSessionInfo()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      const userEmail = user?.email
      if(userId != emptyValue) {
        setUser(user)
      }else if(userEmail && user.uid && !loading) {
        await initFirestore(user.uid)
        .then(() => {setUserId(user.uid); setUserEmail(userEmail); setUser(user)})
        .then(() => initKeychain(user.uid, userEmail))
        .then(() => createIdentity(user.uid, userEmail))
        .then(() => initDb(user.uid).then((DBKey) => {
          setLocalDBKey(DBKey)
        }))
        .then(() => console.log("User: ", user.uid))
        .then(() => setLoading(true))
        .catch((e) => Alert.alert('Erro', e))
      }

      let { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Info', 'É necessário habilitar as notificações para usar esta aplicação.')
      }
    })
  }, [user])

  return (
      <NavigationContainer>
        <View style={{flex: 0.06}}/>
        <Stack.Navigator initialRouteName={pageLogin}>
          {user != null && userId != null && userId != emptyValue ?
          <Stack.Screen name="InsideLayout" component={InsideLayout} options={{title: "InsideLayout", headerShown:false}}/>:
          <>
            <Stack.Screen name={pageLogin} component={SignInPage} options={{title: "LoginPage", headerShown:false}}/>
            <Stack.Screen name={pageSignup} component={SignUpPage} options={{title: "SignupPage", headerShown:false}}/>
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