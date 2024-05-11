import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, Keyboard } from 'react-native'
import { stylesAddCredential, styleScroolView } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import {Navbar} from '../../../navigation/actions'
import { getKey, listAllCredentialsFromFirestore, verifyIfCanManipulateCredentials } from '../../../firebase/firestore/functionalities'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import MainBox from '../../../components/MainBox'
import { Spinner } from '../../../components/LoadingComponents'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { getKeychainValueFor } from '../../../keychain'
import { elderlySSSKey } from '../../../keychain/constants'
import { addCredentialsLabel, emptyValue, pageTitleCredentials, searchLabel } from '../../../assets/constants/constants'
import { MaterialIcons } from '@expo/vector-icons'
import { whiteBackgroud } from '../../../assets/styles/colors'
import { CredentialType } from './types'
import { elderlyName } from '../../list_elderly/styles/styles'
import { credentialsListUpdated } from './state'
import { ScrollItem } from './credentialItem'
import { deriveSecret } from '../../../algorithms/shamirSecretSharing/sss'

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
    <View style= { { flex: 0.1, marginTop: '5%', flexDirection: 'row'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '1%'}, stylesAddCredential.addCredentialButton, stylesButtons.mainConfig]} onPress={navigateToAddCredential}>
          <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[{fontWeight: 'bold'}, stylesAddCredential.addCredentialButtonText]}>{addCredentialsLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

function ElderlyCredentialsList({ elderlyId }: Readonly<{elderlyId: string}>) {

  const [credencials, setCredencials] = useState<CredentialType[]>([])
  const isFocused = useIsFocused()
  const [isFething, setIsFething] = useState(true)
  const [searchValue, setSearchValue] = useState(emptyValue)
  const [searchType, setSearchType] = useState(emptyValue)

  const fetchCredencials = async () => {
    setIsFething(true)
    const cloudKey = await getKey(elderlyId)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    const encryptionKey = deriveSecret([cloudKey, sssKey])
    await listAllCredentialsFromFirestore(elderlyId, encryptionKey, true).then((credencials) => {
      let auxCredencials: CredentialType[] = [];
      credencials.forEach(value => {
        if(value.data && (value.data.platform.toLowerCase().includes(searchValue.toLowerCase()))) {
          if (value.data.type === 'login' && searchType === 'login') {
            auxCredencials.push({id: value.id, data: value.data})
          } else if (value.data.type === 'card' && searchType === 'card') {
            auxCredencials.push({id: value.id, data: value.data})
          } else if (searchType === emptyValue) {
            auxCredencials.push({id: value.id, data: value.data})
          }
        }
      })
      setCredencials(auxCredencials)
    })
    setIsFething(false)
  }

  useEffect(() => {
    credentialsListUpdated.subscribe((credenciais) => setCredencials(credenciais))
  }, [credentialsListUpdated])

  useEffect(() => {
    setIsFething(true)
    fetchCredencials().then(() => setIsFething(false))
  }, [isFocused, searchType])

  return (
    <View style={{ flex: 0.72, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'5%', marginHorizontal: '4%', justifyContent: 'space-around'}, styleScroolView.credencialsContainer]}>
        <View style={{flexDirection: 'row'}}>
          {searchType === 'login' &&
            <TouchableOpacity style={[{flex: 0.2, marginLeft: '2%', marginVertical: '2%'}, stylesButtons.orangeButton, stylesButtons.mainConfig]} onPress={() => setSearchType('card')}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'person'} size={40} color="black"/> 
            </TouchableOpacity>
          }
          {searchType === 'card' &&
            <TouchableOpacity style={[{flex: 0.2, marginLeft: '2%', marginVertical: '2%'}, stylesButtons.purpleButton, stylesButtons.mainConfig]} onPress={() => setSearchType(emptyValue)}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'credit-card'} size={40} color="black"/> 
            </TouchableOpacity>
          }
          {searchType === emptyValue &&
            <TouchableOpacity style={[{flex: 0.2, marginLeft: '2%', marginVertical: '2%'}, stylesButtons.greyButton, stylesButtons.mainConfig]} onPress={() => setSearchType('login')}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'all-inclusive'} size={40} color="black"/> 
            </TouchableOpacity>
          }          
          <View style={[{flex: 1, margin: '2%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
            <TextInput
            placeholder={searchLabel}
            value={searchValue}
            style={{ flex: 1, fontSize: 22, padding: '2%', marginHorizontal: '1%' }}
            onChangeText={(value) => {setSearchValue(value)}}
            />
            <TouchableOpacity style={[{flex: 0.2, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.navigateButton, stylesButtons.mainConfig]} onPress={fetchCredencials}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'search'} size={40} color="black"/> 
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '3%' }}/>
        {isFething ?
        <Spinner width={300} height={300}/> :
        <ScrollView>
          {credencials.map((value, index) => <ScrollItem key={index} credential={value} elderlyId={elderlyId}/>)}
        </ScrollView>}
      </View>
    </View>
  )
}

export default function ElderlyCredentials({ route }: Readonly<{route: any}>) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  const screenWidth = Dimensions.get('window').height
  const fontSize = screenWidth * 0.03

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true))
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false))
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, width: '100%'}}>
          <MainBox text={pageTitleCredentials}/>
          {!isKeyboardOpen && (
          <View style={[{flex: 0.1, justifyContent: 'center', alignItems: 'center'}, elderlyName.container]}>
            <Text style={{fontSize: fontSize}}>{route.params.elderlyName}</Text>
          </View>  )}
          <AddCredencial elderlyId={route.params.elderlyId}/>
          <ElderlyCredentialsList elderlyId={route.params.elderlyId}/>
        </View>
      </KeyboardAvoidingView>
      <Navbar/>
    </>  
  )
}