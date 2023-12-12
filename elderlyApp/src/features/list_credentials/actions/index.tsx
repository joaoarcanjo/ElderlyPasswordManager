import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native'
import { stylesAddCredential, styleScroolView } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { listAllElderlyCredencials } from '../../../firebase/firestore/funcionalities'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import {FlashMessage, copyValue} from '../../../components/ShowFlashMessage'
import MainBox from '../../../components/MainBox'
import { Spinner } from '../../../components/Spinner'
import { useLogin } from '../../login_interface/actions/session'

function AddCredencial() {

  const navigation = useNavigation<StackNavigationProp<any>>();
  
  return (
    <View style= { { flex: 0.10, marginTop: '5%', flexDirection: 'row'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.addCredentialButton, stylesButtons.mainConfig]} onPress={() => {navigation.push('AddCredential')}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.addCredentialButtonText]}>ADICIONAR CREDENCIAIS</Text>
      </TouchableOpacity>
    </View>
  )
}

function ScrollItemExample({credential}: Readonly<{credential: Credential}>) {

  const navigation = useNavigation<StackNavigationProp<any>>();

  const NavigateToCredentialPage = () => navigation.navigate('CredentialPage', {id: credential.id, platform: credential.data.platform, username: credential.data.username, password: credential.data.password})

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>
      <View style={{flex: 0.35, marginVertical: '3%', marginLeft: '6%', flexDirection: 'row', alignItems: 'center'}}>
        {/*<Image source={require('../images/instagram_icon.png')} style={[{width: '20%', height: 50, marginRight: '5%', resizeMode: 'contain'}]}/>*/}
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 30, fontWeight: 'bold' }]}>{credential.data.platform}</Text>
      </View>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginBottom: '3%', flexDirection: 'row'}}>

        <View style={{flex: 0.65, marginRight: '3%'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, styleScroolView.itemCopyUsername, stylesButtons.mainConfig]} onPress={() => copyValue(credential.data.username, FlashMessage.usernameCopied)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar Utilizador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, styleScroolView.itemCopyPassword, stylesButtons.mainConfig]} onPress={() => copyValue(credential.data.password, FlashMessage.passwordCopied)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar Password</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 0.35}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.itemMoreInfoButton, stylesButtons.mainConfig]} onPress={() => {NavigateToCredentialPage()}}>
              <Image source={require('../../../assets/images/more_info.png')} style={[{width: '60%', height: 60, marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

interface Credential {
  id: string,
  data: {
    platform: string,
    username: string,
    password: string
  }
}

function CredentialsList() {

  const [credencials, setCredencials] = useState<Credential[]>([])
  const isFocused = useIsFocused()
  const { userId } = useLogin()

  const [isFething, setIsFething] = useState(true)

  useEffect(() => {
    setIsFething(true)
    listAllElderlyCredencials(userId).then((credencials) => {
      let auxCredencials: Credential[] = [];
      credencials.forEach(value => {
        if(value.data.length != 0) {
          auxCredencials.push({id: value.id, data: JSON.parse(value.data)})
        }
      })
      setCredencials(auxCredencials)
    }).then(() => setIsFething(false))
  }, [isFocused])

  return (
    <View style={{ flex: 0.70, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, flexDirection: 'row', marginTop:'5%', marginHorizontal: '4%', justifyContent: 'space-around'}, styleScroolView.credencialsContainer]}>
        {isFething ?
        <Spinner/> :
        <ScrollView style={[{margin: '3%'}]}>
          {credencials.map((value) => <ScrollItemExample key={value.id} credential={value}/>)}
        </ScrollView>}
      </View>
    </View>
  )
}

export default function Credentials() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={'Credenciais'}/>
      <AddCredencial/>
      <CredentialsList/>
      <Navbar/>
    </View>
  )
}