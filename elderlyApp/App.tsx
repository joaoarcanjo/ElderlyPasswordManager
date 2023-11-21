import { View } from 'react-native';
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

const Stack = createNativeStackNavigator();

export default function App() {

    useEffect(() => {
      initDb()
    }, [])

    return (
        <NavigationContainer>
          <View style={{flex: 0.06}}>
          </View>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={MainMenu} options={{title: "Home", headerShown:false}}/>
              <Stack.Screen name="Credentials" component={Credentials} options={{title: "Credencials", headerShown:false}}/>
              <Stack.Screen name="Settings" component={Settings} options={{title: "Settings", headerShown:false}}/>
              <Stack.Screen name="Generator" component={Generator} options={{title: "Generator", headerShown:false}}/>
              <Stack.Screen name="PasswordHistory" component={PasswordHistory} options={{title: "Password history", headerShown:false}}/>
              <Stack.Screen name="FrequentQuestions" component={FrequentQuestions} options={{title: "Frequent Questions", headerShown:false}}/>
              <Stack.Screen name="Caregivers" component={Caregivers} options={{title: "Caregivers", headerShown:false}}/>
            </Stack.Navigator>
            <FlashMessage/>
        </NavigationContainer>
    );
}
