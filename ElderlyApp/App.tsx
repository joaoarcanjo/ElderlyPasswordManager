import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/features/main_menu/actions';
import Credentials from './src/features/list_credentials/actions';
import Generator from './src/features/password_generator/actions';
import PasswordHistory from './src/features/password_history/actions'
import { MovieRealmContext } from './src/realm';
import FlashMessage from 'react-native-flash-message';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FrequentQuestions from './src/features/frequent_questions/actions';
import Settings from './src/features/settings_interface/actions';
/*
Each time you call push we add a new route to the navigation stack.
When you call navigate it first tries to find an existing route with that name,
and only pushes a new route if there isn't yet one on the stack
*/

const Stack = createNativeStackNavigator();

function App() {

    return (
        <NavigationContainer>
          <MovieRealmContext.RealmProvider>
          <View style={{flex: 0.06}}>
          </View>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={MainMenu} options={{title: "Home", headerShown:false}}/>
              <Stack.Screen name="Credentials" component={Credentials} options={{title: "Credencials", headerShown:false}}/>
              <Stack.Screen name="Generator" component={Generator} options={{title: "Generator", headerShown:false}}/>
              <Stack.Screen name="PasswordHistory" component={PasswordHistory} options={{title: "Password history", headerShown:false}}/>
              <Stack.Screen name="FrequentQuestions" component={FrequentQuestions} options={{title: "Frequent Questions", headerShown:false}}/>
              <Stack.Screen name="Settings" component={Settings} options={{title: "Settings", headerShown:false}}/>
            </Stack.Navigator>
          <FlashMessage position="top" />
          </MovieRealmContext.RealmProvider>
        </NavigationContainer>
    );
}

export default App;