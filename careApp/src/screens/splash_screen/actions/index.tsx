import React from 'react'
import {View, Text} from 'react-native'
import { ElderlyLoading } from '../../../components/LoadingComponents'

export default function SplashScreen({ test }: Readonly<{test: () => Promise<void>}>) {
  const jsonData = require('../../../assets/splashMessages.json')

  const randomIndex = Math.floor(Math.random() * jsonData.messages.length)
  const randomMessage = jsonData.messages[randomIndex]
  return (
    <View style={{ flex: 1, marginHorizontal: '7%', alignItems: 'center', justifyContent: 'center' }}
        onLayout={test}>
          <Text style={{fontSize:40, textAlign: 'center',letterSpacing: 0.5, justifyContent: 'center', color: '#e37629', marginTop: '20%', fontWeight: 'bold'}}>{randomMessage}</Text>
          <View style={{marginTop: '15%'}}>
          <ElderlyLoading/>
        </View>
    </View>
  )
}