import React,{ useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { stylesMainBox, stylesButtons } from '../../../assets/styles/main_style'
import Clipboard from '@react-native-community/clipboard'
import { styleScroolView } from '../styles/styles'
import formatTimestamp from '../../../components/time';
import Navbar from '../../../navigation/actions';
import { db } from '../../../database'

export default function PasswordHistory({ navigation }: {readonly navigation: any}) {

  const [password, setPassword] = useState("");

  useEffect(() => {
    if(password != "") {
      Clipboard.setString(password)
      /*
      showMessage({
        message: 'COPIADO',
        type: 'success',
        icon: props => <Image source={require("../../../assets/images/copy.png")} {...props} />,
        color: "black", // text color
      });*/
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

  interface Password {
    id: string,
    password: string,
    timestamp: number
  }

  function CredentialsList() {

    const [passwords, setPasswords] = useState<Password[]>([]);

    if(db != null) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM passwords ORDER BY timestamp DESC',
          [],
          (txObj, resultSet) => {
            const resultados = resultSet.rows._array as Password[];
            setPasswords(resultados)
          }
        );
      })
    }
    
    return (
      <View style={{ flex: 0.85, flexDirection: 'row', justifyContent: 'space-around'}}>
        <View style={[{ flex: 1, flexDirection: 'row', marginHorizontal: '3%', justifyContent: 'space-around'}, styleScroolView.container]}>
          <ScrollView style={[{margin: '2%'}]}>
            {passwords.map((password) => <PasswordGeneratedItem key={password.id} password={password.password} time={password.timestamp}></PasswordGeneratedItem>)}
          </ScrollView>
        </View>
      </View>
    )
  }
  
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <CredentialsList/>   
      <Navbar navigation={navigation}/>
    </View>
  )
}