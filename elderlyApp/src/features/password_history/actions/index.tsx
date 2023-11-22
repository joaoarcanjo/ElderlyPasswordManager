import React,{ useState } from 'react'
import {View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import { stylesMainBox, stylesButtons } from '../../../assets/styles/main_style'
import * as Clipboard from 'expo-clipboard'
import { styleScroolView } from '../styles/styles'
import formatTimestamp from '../../../components/time';
import Navbar from '../../../navigation/actions';
import { realizarConsulta } from '../../../database'
import { showMessage } from 'react-native-flash-message'
import { Password } from '../../../database/types'

export default function PasswordHistory({ navigation }: {readonly navigation: any}) {

  function SavePassword(password: string) {
    Clipboard.setStringAsync(password)
    showMessage({
      message: 'COPIADO',
      type: 'success',
      icon: props => <Image source={require("../../../assets/images/copy.png")} {...props} />,
      color: "black", // text color
    });
  }

  function MainBox() {
    return (
      <View style= { { flex: 0.15, flexDirection: 'row'} }>
          <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={stylesMainBox.pageInfoText}>Histórico</Text>
          </View>
      </View>
    )
  }
  
  function PasswordGeneratedItem({thisPassword, time}: Readonly<{thisPassword: string, time: number}>) {
    return (
      <View style={[{flex: 0.15, margin: '3%', flexDirection: 'row'}, styleScroolView.item]}>
        <View style={[{flex: 0.7, margin: '2%'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{fontSize: 30, margin: '3%', fontWeight: 'bold' }, styleScroolView.itemPassword]}>{thisPassword}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%', textAlign: 'right' }, styleScroolView.itemDate]}>{formatTimestamp(time)}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.3, margin: '2%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => SavePassword(thisPassword) }>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function PasswordsList() {

    const [passwords, setPasswords] = useState<Password[]>([]);

    realizarConsulta().then(value => setPasswords(value))
    
    return (
      <View style={{ flex: 0.85, flexDirection: 'row'}}>
        <View style={[{ flex: 1, marginHorizontal: '3%'}, styleScroolView.container]}>
          <ScrollView style={[{margin: '2%'}]}>
            {passwords.map((password) => <PasswordGeneratedItem key={password.id} thisPassword={password.password} time={password.timestamp}></PasswordGeneratedItem>)}
          </ScrollView>
        </View>
      </View>
    )
  }
  
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <PasswordsList/>   
      <Navbar navigation={navigation}/>
    </View>
  )
}