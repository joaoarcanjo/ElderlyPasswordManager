import React from 'react'
import {View, Text} from 'react-native'
import { BellLoading } from '../../../components/LoadingComponents'
import { splashStyle } from '../styles/style'

export default function SplashScreen({ layout }: Readonly<{layout: () => Promise<void>}>) {
  const jsonData = require('../../../assets/json/splashMessages.json')

  const randomIndex = Math.floor(Math.random() * jsonData.messages.length)
  const randomMessage = jsonData.messages[randomIndex]
  return (
    <View style={{ flex: 1, marginHorizontal: '7%', alignItems: 'center', justifyContent: 'center' }}
        onLayout={layout}>
          <Text style={[splashStyle.text]}>{randomMessage}</Text>
          <View style={{marginTop: '15%'}}>
          <BellLoading/>
        </View>
    </View>
  )
}