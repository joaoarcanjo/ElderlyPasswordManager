import React,{ useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { stylesMainBox, stylesButtons } from '../../../assets/styles/main_style'
import Clipboard from '@react-native-community/clipboard'
import { showMessage } from 'react-native-flash-message';
import { styleScroolView } from '../styles/styles'
import { MovieRealmContext } from '../../../realm/index'
import { GeneratedPassword } from '../../../realm/Models';
import formatTimestamp from '../../../components/time';

export default function PasswordHistory({ navigation }: {readonly navigation: any}) {

  const { useQuery } = MovieRealmContext;

  const [password, setPassword] = useState("");

  useEffect(() => {
    if(password != "") {
      Clipboard.setString(password)
      showMessage({
        message: 'COPIADO',
        type: 'success',
        icon: props => <Image source={require("../../../assets/images/copy.png")} {...props} />,
        color: "black", // text color
      });
    }
  }, [password])

  function MainBox() {
    return (
      <View style= { { flex: 0.15, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={stylesMainBox.pageInfoText}>Histórico</Text>
          </View>
      </View>
    )
  }
  
  function PasswordGeneratedItem({password, time}: Readonly<{password: string, time: number}>) {
    return (
      <View style={[{flex: 0.15, width: '95%', margin: '3%', flexDirection: 'row'}, styleScroolView.item]}>
        <View style={[{flex: 0.7, margin: '2%', justifyContent: 'center'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{fontSize: 30, margin: '3%', fontWeight: 'bold' }, styleScroolView.itemPassword]}>{password}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%', textAlign: 'right' }, styleScroolView.itemDate]}>{formatTimestamp(time)}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.3, margin: '2%', justifyContent: 'center',  alignItems: 'center'}, stylesButtons.copyButton]} onPress={() => setPassword(password)}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function CredentialsList() {
    const passwordsGenerated = useQuery(GeneratedPassword, passwords => {
      return passwords.sorted('creationTimestamp', true)
    });

    return (
      <View style={{ flex: 0.85, flexDirection: 'row', justifyContent: 'space-around'}}>
        <View style={[{ flex: 1, flexDirection: 'row', marginHorizontal: '3%', justifyContent: 'space-around'}, styleScroolView.container]}>
          <ScrollView style={[{margin: '2%'}]}>
            {passwordsGenerated.map(password => (
              <PasswordGeneratedItem 
                key={password._id} 
                password={password.password} 
                time={password.creationTimestamp}/>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }
  
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <CredentialsList/>   
    </View>
  )
}