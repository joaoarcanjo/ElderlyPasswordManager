import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainMenu from './src/screens/main_menu/actions';
import ElderlyListScreen from './src/screens/list_elderly/actions';
import { initDb } from './src/database';
import ChatPageTest from './src/screens/list_elderly/actions/indexTest';
import FlashMessage from "react-native-flash-message";

const Stack = createNativeStackNavigator()

function Inicialization() {

  useEffect(() => {
    console.debug("#-> InsideLayout: useEffect called.")

    initDb()
  }, [])

  return (
      <NavigationContainer>
        <View style={{flex: 0.06}}/>
        <Stack.Navigator initialRouteName="MainMenu">
          <Stack.Screen name="MainMenu" component={MainMenu} options={{title: "MainMenu", headerShown:false}}/>
          <Stack.Screen name="ElderlyList" component={ElderlyListScreen} options={{ title: "listElderly", headerShown: false }} />
          <Stack.Screen name="ChatTest" component={ChatPageTest} options={{ title: "listElderly", headerShown: false }} />
        </Stack.Navigator>
        <FlashMessage/>
      </NavigationContainer>
  );
}

export default function App() {
  return (
      <Inicialization/>
  )
}