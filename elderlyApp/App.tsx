import { Platform, View } from 'react-native';
import MainMenu from './src/features/main_menu/actions';
import Credentials from './src/features/list_credentials/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './src/features/settings_interface/actions';
import FrequentQuestions from './src/features/list_questions/actions';
import Generator from './src/features/password_generator/actions';
import PasswordHistory from './src/features/password_history/actions';
import React, { useEffect } from 'react';
import { initDb } from './src/database';
import FlashMessage from 'react-native-flash-message';
import Caregivers from './src/features/list_caregivers/actions';
import { changeKey, initFirestore } from './src/firebase/firestore/funcionalities';
import { cleanKeychain, initKeychain } from './src/keychain';
import { AddCredencial } from './src/features/add_credentials/actions';
import { initSSS } from './src/algorithms/sss/sss';
import CredencialPage from './src/features/credential_interface/actions';
import LoginPage from './src/features/login_interface/actions';

export type RootStackParamList = {
  Home: undefined;
  Credentials: undefined;
  AddCredential: undefined;
  Settings: undefined;
  PasswordHistory: undefined;
  FrequentQuestions: undefined;
  Caregivers: undefined;
  Generator: undefined;
  CredentialPage: { platform: string, username: string, password: string };
  LoginPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const elderlyIdForTest = 'elderlyIdForTest'+Platform.OS

const im_testing = false

export default function App() {

    useEffect(() => {

      if(im_testing) {
        cleanKeychain()
      } else {
        initKeychain(elderlyIdForTest)
        .then(() => initSSS())
        .then(() => initDb())
        .then(() => initFirestore())
        .then(() => changeKey())
      }
  
    }, [])

    return (
        <NavigationContainer>
          <View style={{flex: 0.06}}/>
          <Stack.Navigator initialRouteName="LoginPage">
            <Stack.Screen name="Home" component={MainMenu} options={{title: "Home", headerShown:false}}/>
            <Stack.Screen name="Credentials" component={Credentials} options={{title: "Credencials", headerShown:false}}/>
            <Stack.Screen name="AddCredential" component={AddCredencial} options={{title: "AddCredencial", headerShown:false}}/>
            <Stack.Screen name="Settings" component={Settings} options={{title: "Settings", headerShown:false}}/>
            <Stack.Screen name="Generator" component={Generator} options={{title: "Generator", headerShown:false}}/>
            <Stack.Screen name="PasswordHistory" component={PasswordHistory} options={{title: "Password history", headerShown:false}}/>
            <Stack.Screen name="FrequentQuestions" component={FrequentQuestions} options={{title: "Frequent Questions", headerShown:false}}/>
            <Stack.Screen name="Caregivers" component={Caregivers} options={{title: "Caregivers", headerShown:false}}/>
            <Stack.Screen name="CredentialPage" component={CredencialPage} options={{title: "CredencialPage", headerShown:false}}  />
            <Stack.Screen name="LoginPage" component={LoginPage} options={{title: "LoginPage", headerShown:false}}  />
          </Stack.Navigator>
          <FlashMessage/>
        </NavigationContainer>
    );
}