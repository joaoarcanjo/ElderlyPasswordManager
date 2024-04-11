import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, ScrollView, Linking, TextInput} from 'react-native'
import { stylesAddCredential, styleScroolView } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import  { Navbar } from "../../../navigation/actions";
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import MainBox from '../../../components/MainBox'
import { Spinner } from '../../../components/LoadingComponents'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { usePushNotifications } from '../../../notifications/usePushNotifications'
import { sendPushNotification } from '../../../notifications/functionalities'
import { credentialsListUpdated } from './state'
import { getAllCredentialsAndValidate, getAllLocalCredentialsFormatted, getAllLocalCredentialsFormattedWithFilter } from './functions'
import { addCredentialsLabel, detailsLabel, navigateLabel, pageAddCredential, pageCredential, pageTitleCredentials, searchLabel } from '../../../assets/constants'
import { whiteBackgroud } from '../../../assets/styles/colors';
import { MaterialIcons } from '@expo/vector-icons';

function AddCredencial() {

  const navigation = useNavigation<StackNavigationProp<any>>();
  
  return (
    <View style= { { flex: 0.10, marginTop: '5%', flexDirection: 'row'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.addCredentialButton, stylesButtons.mainConfig]} onPress={() => {navigation.push(pageAddCredential)}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.addCredentialButtonText]}>{addCredentialsLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

function ScrollItemExample({credential}: Readonly<{credential: Credential}>) {

  const navigation = useNavigation<StackNavigationProp<any>>();
  const { setUsernameCopied, setPasswordCopied, usernameCopied, passwordCopied } = useSessionInfo()
  const { expoPushToken } = usePushNotifications()

  const OpenCredentialPage = () => {
    navigation.navigate(pageCredential, 
    { 
      id: credential.id, 
      platform: credential.data.platform, 
      uri: credential.data.uri, 
      edited: credential.data.edited,
      username: credential.data.username, 
      password: credential.data.password 
    })
  }

  const NavigateToApp = async (uri: string, plataforma: string, username: string, password: string) => { 
    setUsernameCopied(username)
    setPasswordCopied(password)

    const message = {
      to: expoPushToken?.data,
      sound: "default",
      title: "Credenciais " + plataforma,
      body: "Copie em seguida o que necessita:",
      data: {},
      categoryId: `credentials`
    }
    
    sendPushNotification(message)
    Linking.openURL('https://'+uri)
  }

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>
      <View style={{flex: 0.35, marginVertical: '3%', marginLeft: '6%', flexDirection: 'row', alignItems: 'center'}}>
        {/*<Image source={require('../images/instagram_icon.png')} style={[{width: '20%', height: 50, marginRight: '5%', resizeMode: 'contain'}]}/>*/}
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 30, fontWeight: 'bold' }]}>{credential.data.platform}</Text>
      </View>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginBottom: '3%', flexDirection: 'row'}}>
        {/*
        <View style={{flex: 0.65, marginRight: '3%'}}>          
          <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, styleScroolView.itemCopyUsername, stylesButtons.mainConfig]} onPress={() => copyValue(credential.data.username, FlashMessage.usernameCopied)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar Utilizador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, styleScroolView.itemCopyPassword, stylesButtons.mainConfig]} onPress={() => copyValue(credential.data.password, FlashMessage.passwordCopied)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar Password</Text>
          </TouchableOpacity>
        </View>
        */}   
        <View style={{flex: 1, marginHorizontal: '3%', flexDirection: 'row'}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.itemMoreInfoButton, stylesButtons.mainConfig]} onPress={() => {OpenCredentialPage()}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{detailsLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.navigateButton, stylesButtons.mainConfig]} onPress={() => {NavigateToApp(credential.data.uri, credential.data.platform, credential.data.username, credential.data.password)}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{navigateLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

interface Credential {
  id: string,
  data: {
      id: string,
      platform: string,
      uri: string,
      username: string,
      password: string,
      edited: {
          updatedBy: string,
          updatedAt: number
      }
  }
}

function CredentialsList() {

  const [credencials, setCredencials] = useState<(Credential | undefined)[]>([])
  const isFocused = useIsFocused()
  const { userId, localDBKey } = useSessionInfo()

  const [isFething, setIsFething] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setIsFething(true)
    credentialsListUpdated.subscribe(() => {refreshValue()})
  }, [credentialsListUpdated, isFocused])

  const refreshValue = async () => {
    setIsFething(true)
    getAllCredentialsAndValidate(userId, localDBKey)
    await getAllLocalCredentialsFormatted(userId, localDBKey)
    .then((credentials) => {   
      setCredencials(credentials)
      setIsFething(false)
    })
  }

  const search = async (value: string) => {
    setIsFething(true)
    await getAllLocalCredentialsFormattedWithFilter(userId, localDBKey, value)
    .then((credentials) => {   
      setCredencials(credentials)
      setIsFething(false)
    })
  }

  return (
    <View style={{ flex: 0.70, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'5%', marginHorizontal: '4%', justifyContent: 'space-around'}, styleScroolView.credencialsContainer]}>
        <View style={[{margin: '2%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
          <TextInput
          placeholder={searchLabel}
          value={searchValue}
          style={{ flex: 1, fontSize: 22, padding: '2%', marginHorizontal: '1%' }}
          onChangeText={(value) => {setSearchValue(value)}}
          />
          <TouchableOpacity style={[{flex: 0.2, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.navigateButton, stylesButtons.mainConfig]} onPress={() => search(searchValue)}>
            <MaterialIcons style={{marginHorizontal: '1%'}} name={'search'} size={40} color="black"/> 
          </TouchableOpacity>
        </View>
        {isFething ?
        <Spinner/> :
        <ScrollView>
          {credencials.map((value: Credential | undefined) => {
            if(value != undefined) {
              return <ScrollItemExample key={value.id} credential={value}/>
            }
          })}
        </ScrollView>}
      </View>
    </View>
  )
}

export default function Credentials() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={pageTitleCredentials}/>
      <AddCredencial/>
      <CredentialsList/>
      <Navbar/>
    </View>
  )
}