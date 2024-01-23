import { View } from 'react-native';
import MainMenu from './src/screens/main_menu/actions';
import Credentials from './src/screens/list_credentials/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './src/screens/settings_interface/actions';
import FrequentQuestions from './src/screens/list_questions/actions';
import Generator from './src/screens/password_generator/actions';
import PasswordHistory from './src/screens/password_history/actions';
import React, { useEffect, useState } from 'react';
import { initDb } from './src/database';
import FlashMessage from 'react-native-flash-message';
import Caregivers from './src/screens/list_caregivers/actions';
import { changeKey, initFirestore } from './src/firebase/firestore/funcionalities';
import { cleanKeychain, initKeychain } from './src/keychain';
import { AddCredencial } from './src/screens/add_credentials/actions';
import { initSSS } from './src/algorithms/sss/sss';
import CredencialPage from './src/screens/credential_interface/actions';
import SignInPage from './src/screens/signin_interface/actions';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/FirebaseConfig';
import PermissionsPage from './src/screens/permissions_interface/actions';
import { LoginProvider, useLogin } from './src/firebase/authentication/session';
import SignUpPage from './src/screens/signup_interface/actions';
import { usePushNotifications } from './src/notifications/usePushNotifications';
import { StatusBar } from 'expo-status-bar';


const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()

const im_testing = false

function InsideLayout() {
  const { userId, setShared } = useLogin()
  
  useEffect(() => {
    console.debug("#-> InsideLayout: useEffect called.")

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
  const { setUserId, setUserEmail, setLocalDBKey, userId } = useLogin()

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      //console.log("User: " + user)
      //console.log("UserId: " + userId)
      if(userId) {
        setUser(user)
      }else if(user != null && user.email) {
        initKeychain(user.uid, user.email).then(DBKey => setLocalDBKey(DBKey))
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
          <Stack.Screen name="Inside" component={InsideLayout} options={{title: "Inside", headerShown:false}}/>
          :
          <>
            <Stack.Screen name="LoginPage" component={SignInPage} options={{title: "LoginPage", headerShown:false}}/>
            <Stack.Screen name="SignupPage" component={SignUpPage} options={{title: "SignupPage", headerShown:false}}/>
            <InsideStack.Screen name="Home" component={MainMenu} options={{title: "Home", headerShown:false}}/>
          </>
          }
        </Stack.Navigator>
        <FlashMessage/>
      </NavigationContainer>
  );
}

export default function App() {

  //const { expoPushToken } = usePushNotifications()
  //console.log("Expo token: "+expoPushToken?.data)

  return (
    <LoginProvider>
      <StatusBar hidden />
      <Inicialization/>
    </LoginProvider>
  )
}