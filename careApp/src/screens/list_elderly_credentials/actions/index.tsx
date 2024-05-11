import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { elderlyName, stylesAddCredential, styleScroolView } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import {Navbar} from '../../../navigation/actions'
import { getKey, listAllCredentialsFromFirestore, verifyIfCanManipulateCredentials } from '../../../firebase/firestore/functionalities'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import MainBox from '../../../components/MainBox'
import { Spinner } from '../../../components/LoadingComponents'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { credentialsListUpdated } from './state'
import { getKeychainValueFor } from '../../../keychain'
import { elderlySSSKey } from '../../../keychain/constants'
import { MaterialIcons } from '@expo/vector-icons'
import { whiteBackgroud } from '../../../assets/styles/colors'
import { CredentialType } from '../../list_credentials/actions/types'
import { deriveSecret } from '../../../algorithms/shamirSecretSharing/sss'
import { addCredentialsLabel, pageCredentialLogin, pageCredentialCard, detailsLabel, searchLabel, pageTitleCredentials } from '../../../assets/constants/constants'

function AddCredencial({ elderlyId }: Readonly<{elderlyId: string}>) {

  const navigation = useNavigation<StackNavigationProp<any>>()
  const { userId } = useSessionInfo()

  const navigateToAddCredential = async () => {
    const canCreate = await verifyIfCanManipulateCredentials(userId, elderlyId)
    const cloudKey = await getKey(elderlyId)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    const encryptionKey = deriveSecret([cloudKey, sssKey]) 

    if(canCreate) {
      navigation.navigate('AddCredential', { userId: elderlyId, key: encryptionKey, isElderlyCredential: true })
    } else {
      alert('Você não tem permissão para adicionar credenciais.')
    }
  }

  return (
    <View style= { { flex: 0.10, marginTop: '5%', flexDirection: 'row'} }>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.addCredentialButton, stylesButtons.mainConfig]} onPress={navigateToAddCredential}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.addCredentialButtonText]}>{addCredentialsLabel}</Text>
        </TouchableOpacity>
    </View>
  )
}

function ScrollItemExample({credential, elderlyId}: Readonly<{credential: CredentialType, elderlyId: string}>) {

  const navigation = useNavigation<StackNavigationProp<any>>();
  //const { setUsernameCopied, setPasswordCopied, usernameCopied, passwordCopied } = useSessionInfo()
  //const { expoPushToken } = usePushNotifications()

  const OpenCredentialPage = async () => {
    
    const cloudKey = await getKey(elderlyId)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    const encryptionKey = deriveSecret([cloudKey, sssKey]) 

    if ('uri' in credential.data) {
      navigation.navigate(pageCredentialLogin, 
        { 
          id: credential.id, 
          userId: elderlyId,
          platform: credential.data.platform, 
          uri: credential.data.uri, 
          edited: credential.data.edited,
          username: credential.data.username, 
          password: credential.data.password,
          key: encryptionKey,
          isElderlyCredential: true
        })
    } else if ('cardNumber' in credential.data) {
      navigation.navigate(pageCredentialCard, 
        { 
          id: credential.id, 
          userId: elderlyId,
          platform: credential.data.platform, 
          cardNumber: credential.data.cardNumber, 
          ownerName: credential.data.ownerName, 
          securityCode: credential.data.securityCode, 
          verificationCode: credential.data.verificationCode,
          edited: credential.data.edited,
          key: encryptionKey,
          isElderlyCredential: true
        })
    }
  }

  const NavigateToApp = async (uri: string, plataforma: string, username: string, password: string) => { 
    //setUsernameCopied(username)
    //setPasswordCopied(password)
    const message = {
      //to: expoPushToken?.data,
      sound: "default",
      title: "Credenciais " + plataforma,
      body: "Copie em seguida o que necessita:",
      data: {},
      categoryId: `credentials`
    }
    
    //sendPushNotification(message)
    //Linking.openURL('https://'+uri)
  }

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>
      <View style={{flex: 0.35, marginVertical: '3%', marginLeft: '6%', flexDirection: 'row', alignItems: 'center'}}>
        {/*<Image source={require('../images/instagram_icon.png')} style={[{width: '20%', height: 50, marginRight: '5%', resizeMode: 'contain'}]}/>*/}
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 30, fontWeight: 'bold' }]}>{credential.data.platform}</Text>
      </View>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginBottom: '3%', flexDirection: 'row'}}> 
        <View style={{flex: 1, marginHorizontal: '3%', flexDirection: 'row'}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.itemMoreInfoButton, stylesButtons.mainConfig]} onPress={() => {OpenCredentialPage()}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{detailsLabel}</Text>
          </TouchableOpacity>
          {/*
                    <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.navigateButton, stylesButtons.mainConfig]} onPress={() => {NavigateToApp(credential.data.uri, credential.data.platform, credential.data.username, credential.data.password)}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{navigateLabel}</Text>
          </TouchableOpacity>
          */}
        </View>
      </View>
    </View>
  )
}

function ElderlyCredentialsList({ elderlyId }: Readonly<{elderlyId: string}>) {

  const [credencials, setCredencials] = useState<CredentialType[]>([])
  const isFocused = useIsFocused()
  const [isFething, setIsFething] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  const fetchCredencials = async () => {
    const cloudKey = await getKey(elderlyId)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    const encryptionKey = deriveSecret([cloudKey, sssKey])
    await listAllCredentialsFromFirestore(elderlyId, encryptionKey, true).then((credencials) => {
      let auxCredencials: CredentialType[] = [];
      credencials.forEach(value => {
        if(value.data.type === 'login' || value.data.type === 'card') {
          auxCredencials.push({id: value.id, data: value.data})
        }
      })
      setCredencials(auxCredencials)
    })
  }

  const search = async (valueSearch: string) => {
    setIsFething(true)

    const cloudKey = await getKey(elderlyId)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    const encryptionKey = deriveSecret([cloudKey, sssKey])

    await listAllCredentialsFromFirestore(elderlyId, encryptionKey, true).then((credencials) => {
      let auxCredencials: CredentialType[] = [];
      credencials.forEach(value => {
        if(value.data && (value.data.platform.toLowerCase().includes(valueSearch.toLowerCase()))) {
          auxCredencials.push({id: value.id, data: value.data})
        }
      })
      setCredencials(auxCredencials)
      setIsFething(false)
    })
  }

  useEffect(() => {
    credentialsListUpdated.subscribe((credenciais) => setCredencials(credenciais))
  }, [credentialsListUpdated])

  useEffect(() => {
    setIsFething(true)
    fetchCredencials().then(() => setIsFething(false))
  }, [isFocused])

  return (
    <View style={{ flex: 0.60, flexDirection: 'row', justifyContent: 'space-around'}}>
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
        <Spinner width={300} height={300}/> :
        <ScrollView>
          {credencials.map((value, index) => <ScrollItemExample key={index} credential={value} elderlyId={elderlyId}/>)}
        </ScrollView>}
      </View>
    </View>
  )
}

export default function ElderlyCredentials({ route }: Readonly<{route: any}>) {

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={pageTitleCredentials}/>
      <View style={[{flex: 0.06, justifyContent: 'center', alignItems: 'center'}, elderlyName.container]}>
          <Text style={elderlyName.text}>{route.params.elderlyName}</Text>
      </View>
      <AddCredencial elderlyId={route.params.elderlyId}/>
      <ElderlyCredentialsList elderlyId={route.params.elderlyId}/>
      <Navbar/> 
    </View>
  )
}