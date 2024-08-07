import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { ElderlyLoading } from '../../../components/LoadingComponents'
import { splashStyle } from '../styles/style'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { pageMainMenu } from '../../../assets/constants/constants'
import { stylesButtons } from '../../../assets/styles/main_style'
import { historyTextColor } from '../../../assets/styles/colors'
import { buttonNormalTextSize } from '../../../assets/styles/text'

export default function SplashScreen({ layout }: Readonly<{layout: () => Promise<void>}>) {
  const jsonData = require('../../../assets/json/splashMessages.json')

  const randomIndex = Math.floor(Math.random() * jsonData.messages.length)
  const randomMessage = jsonData.messages[randomIndex]
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (
    <View style={{ flex: 1, marginHorizontal: '7%', marginVertical: '20%', alignItems: 'center', justifyContent: 'center' }}
        onLayout={layout}>
        <View style={[{flex: 0.9}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[splashStyle.text1]}>{'Sugestão do dia: '}</Text>
          <Text numberOfLines={5} adjustsFontSizeToFit style={[splashStyle.text2]}>{randomMessage}</Text>
          <ElderlyLoading width={250} height={250}/>
        </View>
        <TouchableOpacity style={[{flex: 0.10, marginTop: '15%', marginBottom: '3%'}, splashStyle.continueButton, stylesButtons.mainConfig]} onPress={() => {navigation.push(pageMainMenu)}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ marginHorizontal: '15%', fontWeight: 'bold', fontSize: buttonNormalTextSize, color: historyTextColor }]}>{'Fechar Sugestão'}</Text>
        </TouchableOpacity>
    </View>
  )
}