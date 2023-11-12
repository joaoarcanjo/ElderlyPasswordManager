import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/features/main_menu/actions';
import Credentials from './src/features/list_credentials/actions';
import Generator from './src/features/password_generator/actions';
import PasswordHistory from './src/features/password_history/actions'
import { MovieRealmContext } from './src/realm';
import FlashMessage from 'react-native-flash-message';
/*
Each time you call push we add a new route to the navigation stack.
When you call navigate it first tries to find an existing route with that name,
and only pushes a new route if there isn't yet one on the stack*/

const Stack = createNativeStackNavigator();

function App() {

    return (
        <NavigationContainer>
          <MovieRealmContext.RealmProvider>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={MainMenu} />
              <Stack.Screen name="Credentials" component={Credentials} />
              <Stack.Screen name="Generator" component={Generator} />
              <Stack.Screen name="PasswordHistory" component={PasswordHistory} />
            </Stack.Navigator>
          <FlashMessage position="top" />
          </MovieRealmContext.RealmProvider>
        </NavigationContainer>
    );
}

export default App;