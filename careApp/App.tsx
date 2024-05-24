import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/screens/main_menu/actions';
import ElderlyListScreen from './src/screens/list_elderly/actions';
import { initDb } from './src/database';
import FlashMessage from "react-native-flash-message";
import { AddCredencial } from './src/screens/add_credentials/actions';
import { SessionProvider, useSessionInfo } from './src/firebase/authentication/session';
import * as Notifications from "expo-notifications";
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import { initKeychain } from './src/keychain';
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
import pbkdf2 from 'pbkdf2';
import { getNewId } from './src/algorithms/tweetNacl/crypto';
/*import Crypto from 'react-native-quick-crypto';

// Function to generate a random alphanumeric string
export function generateRandomString() {
  return Math.random().toString(36).substring(2);
}

// Configuration for PBKDF2
const ITERATIONS = 1000; // Iterations count, adjustable
const KEY_LENGTH = 64;   // Output key length in bytes (512 bits)
const ALGORITHM = 'SHA256'; // Hashing algorithm, can be changed

// Asynchronous function to generate a renewal token
export async function generateToken(token: string, authToken: string) {
  // Creating a unique salt by combining authToken with a random string
  const salt = authToken + generateRandomString();

  // Generating a hash using PBKDF2
  const hash = Crypto.pbkdf2Sync(
    token,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    ALGORITHM
  );

  // Converting the hash to a hexadecimal string
  const renewalToken = Buffer.from(hash).toString('hex');

  // Returning the generated salt and renewal token
  return { salt, renewalToken };
}*/

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()

function InsideLayout() {

  return (
    <InsideStack.Navigator initialRouteName={pageMainMenu}>
      <InsideStack.Screen name={pageMainMenu} component={MainMenu} options={{ title: "MainMenu", headerShown: false }} />
      <InsideStack.Screen name={pageCredentials} component={Credentials} options={{ title: "Credencials", headerShown: false }} />
      <InsideStack.Screen name={pageElderlyList} component={ElderlyListScreen} options={{ title: "listElderly", headerShown: false }} />
      <InsideStack.Screen name={pageElderlyCredentials} component={ElderlyCredentials} options={{ title: "ElderlyCredencials", headerShown: false }} />
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

  //
  //console.log(arrayBufferToString(pbkdf2.pbkdf2Sync('password', getNewId(), 1, 32, 'sha512')))

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      const userEmail = user?.email
      if(userId) {
        setUser(user)
      }else if(userEmail && user.uid && !loading) {
        await initKeychain(user.uid, user.email)
        .then((DBKey) => setLocalDBKey(DBKey))
        .then(() => { setUserId(user.uid); setUserEmail(userEmail); setUser(user)})
        .then(() => initFirestore(user.uid))
        .then(() => createIdentity(user.uid, userEmail))
        .then(() => initDb()) 
        .then(() => setLoading(true))
        .catch((e) => alert(e))
      }

      let { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        alert('É necessário habilitar as notificações para usar esta aplicação.')
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