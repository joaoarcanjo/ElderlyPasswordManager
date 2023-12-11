import React from 'react'
import {View, Text, TouchableOpacity, Image, Linking} from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { accountInfo, appInfo, logout } from '../styles/styles'
import MainBox from '../../../components/MainBox'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FIREBASE_AUTH } from '../../../firebase/FirebaseConfig'
import { elderlyEmail, elderlyPwd } from '../../../keychain/constants'
import { save } from '../../../keychain'

const gitHubUrl = 'https://github.com/joaoarcanjo/ThesisApps'

function AccountInfo() {
  return (
    <View style={{ flex: 0.45, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'2%', marginHorizontal: '4%'}, accountInfo.accountInfoContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Informação da conta</Text>
        <View style={[{ flex: 0.32, marginTop:'2%', width: '25%', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, accountInfo.accountInfo]}>
          <Image source={require('../../../assets/images/elderly.png')} style={[{height: '80%', margin: '2%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, accountInfo.accountInfo]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, accountInfo.accountInfoText]}>+351 965537775</Text>
          <Image source={require('../images/telephone.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={[{ flex: 0.20, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, accountInfo.accountInfo]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, accountInfo.accountInfoText]}>joaopedro.arcanjo@hotmail.com</Text>
          <Image source={require('../images/email.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <TouchableOpacity style={[{flex: 0.17, margin: '2%', width: '45%'}, accountInfo.editButton, stylesButtons.mainConfig]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 25 }]}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const onGitHub = () => Linking.canOpenURL(gitHubUrl).then(() => {
  Linking.openURL(gitHubUrl);
});

function AppInfo() {
  return (
    <View style={{ flex: 0.20, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'5%', marginHorizontal: '4%'}, appInfo.appInfoContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.3, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>APP</Text>
        <TouchableOpacity style={[{ flex: 0.6, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, appInfo.appInfoButton, stylesButtons.mainConfig]} onPress={() => onGitHub()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 1, marginLeft: '7%'}, appInfo.appInfoText]}>Mais sobre a aplicação</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function Logout() {
  
  const navigation = useNavigation<StackNavigationProp<any>>()
  
  const signOut = () => {
    save(elderlyEmail, '')
    save(elderlyPwd, '')
    FIREBASE_AUTH.signOut()
  }

  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around', marginBottom: '2%'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, logout.logoutButton, stylesButtons.mainConfig]} onPress={signOut}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, logout.logoutButtonText]}>SAIR DA CONTA</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function Settings() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={'Definições'}/>
      <AccountInfo/>
      <AppInfo/>
      <Logout/>
      <Navbar/>
    </View>
  )
}