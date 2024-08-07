import React,{ useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import formatTimestamp from '../../../components/time';
import  { Navbar } from "../../../navigation/actions";
import { getGeneratedPasswords } from '../../../database/passwords'
import { Password } from '../../../database/types';
import MainBox from '../../../components/MainBox';
import { useSessionInfo } from '../../../context/session';
import { copyLabel, pageTitleHistory } from '../../../assets/constants/constants';
import { copyPasswordDescription, FlashMessage } from '../../../assets/constants/messages';
import { copyValue } from '../../../notifications/UserMessages';
import { options } from '../../credential_interface/styles/styles';
import { styleScroolView } from '../styles/styles';

export default function PasswordHistory() {

  const copyPassword = (password: string) => {
    copyValue(password, FlashMessage.passwordCopied, copyPasswordDescription)
  }
  
  function PasswordGeneratedItem({thisPassword, time}: Readonly<{thisPassword: string, time: number}>) {
    return (
      <View style={[{flex: 0.15, margin: '3%', flexDirection: 'row'}, styleScroolView.item]}>
        <View style={[{flex: 0.7, margin: '2%'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%', fontWeight: 'bold' }, styleScroolView.itemPassword]}>{thisPassword}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%', textAlign: 'right' }, styleScroolView.itemDate]}>{formatTimestamp(time)}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.3, margin: '2%'}, stylesButtons.copyButton, stylesButtons.mainConfig]} onPress={() => copyPassword(thisPassword) }>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.copyButtonText]}>{copyLabel}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function PasswordsList() {

    const [passwords, setPasswords] = useState<Password[]>([]);
    const { localDBKey, userId } = useSessionInfo();

    useEffect(() => {
      getGeneratedPasswords(localDBKey, userId).then(value => setPasswords(value))
    }, [])
    
    return (
      <View style={{ flex: 0.85, marginTop: '5%', flexDirection: 'row'}}>
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
      <MainBox text={pageTitleHistory}/>
      <PasswordsList/>   
      <Navbar/>
    </View>
  )
}