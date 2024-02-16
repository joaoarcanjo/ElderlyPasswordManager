import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/screens/main_menu/actions';
import Elderly from './src/screens/list_elderly/actions';


const Stack = createNativeStackNavigator()

function Inicialization() {

  return (
      <NavigationContainer>
        <View style={{flex: 0.06}}/>
        <Stack.Navigator initialRouteName="MainMenu">
            <Stack.Screen name="MainMenu" component={MainMenu} options={{title: "MainMenu", headerShown:false}}/>
            <Stack.Screen name="ElderlyList" component={Elderly} options={{ title: "listElderly", headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default function App() {
  return (
      <Inicialization/>
  )
}