/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/features/main_menu/actions/index';
import Credentials from './src/features/list_credentials/actions/index';
import Generator from './src/features/password_generator/actions';

/*
Each time you call push we add a new route to the navigation stack.
When you call navigate it first tries to find an existing route with that name,
and only pushes a new route if there isn't yet one on the stack*/


const Stack = createNativeStackNavigator();

function App() {

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={MainMenu} />
          <Stack.Screen name="Credentials" component={Credentials} />
          <Stack.Screen name="Generator" component={Generator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;