import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image} from 'react-native'
import { stylesAddCredential, styleScroolView } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import  { Navbar } from "../../../navigation/actions";
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import MainBox from '../../../components/MainBox'
import { Spinner } from '../../../components/LoadingComponents'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { credentialsListUpdated } from './state'
import { getAllCredentialsAndValidate, getAllLocalCredentialsFormatted, getAllLocalCredentialsFormattedWithFilter } from './functions'
import { addCredentialsLabel, allLabel, cardsLabel, closeLabel, detailsLabel, emptyValue, loginLabel, optionsLabel, pageAddCredential, pageTitleCredentials, passosLabel, perguntasLabel, searchLabel, seeMoreLabel, sugestoesLabel } from '../../../assets/constants/constants'
import { darkBlueBackground, whiteBackgroud } from '../../../assets/styles/colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { CredentialType } from './types';
import { ScrollItem } from './credentialItem';
import { options } from '../../credential_interface/styles/styles';

function AddCredencial() {

  const navigation = useNavigation<StackNavigationProp<any>>();
  
  return (
    <View style= { { flex: 0.1, marginTop: '5%', flexDirection: 'row'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '1%'}, stylesAddCredential.addCredentialButton, stylesButtons.mainConfig]} onPress={() => {navigation.push(pageAddCredential)}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{fontWeight: 'bold'}, stylesAddCredential.addCredentialButtonText]}>{addCredentialsLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

function CredentialsList() {

  const [credencials, setCredencials] = useState<(CredentialType | undefined)[]>([])
  const isFocused = useIsFocused()
  const { userId, localDBKey } = useSessionInfo()

  const [isFething, setIsFething] = useState(true)
  const [searchValue, setSearchValue] = useState(emptyValue)
  const [searchType, setSearchType] = useState(emptyValue)
  const [buttonSelected, setButtonSelected] = useState(0)
  const [showFilter, setShowFilter] = useState(false)

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

  const search = async () => {
    setIsFething(true)
    await getAllLocalCredentialsFormattedWithFilter(userId, localDBKey, searchValue)
    .then((credentialsAux) => {  
      let auxCredencials: CredentialType[] = [];
      credentialsAux.forEach(value => {
        if(value && value.data && (value.data.platform.toLowerCase().includes(searchValue.toLowerCase()))) {
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
      setIsFething(false)
    })
  }

  useEffect(() => {search()}, [searchType])

  const allSelected = buttonSelected === 0 ? stylesButtons.blueButton : stylesButtons.whiteButton
  const cardsSelected = buttonSelected === 1 ? stylesButtons.blueButton : stylesButtons.whiteButton
  const loginsSelected = buttonSelected === 2 ? stylesButtons.blueButton : stylesButtons.whiteButton

  return (
    <View style={{ flex: 0.72, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'5%', marginHorizontal: '4%', justifyContent: 'space-around'}, styleScroolView.credencialsContainer]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.25, marginLeft: '2%', marginVertical: '1%'}}>
            <TouchableOpacity style={[{flex: 1, justifyContent: 'center',  alignItems: 'center'}, stylesButtons.whiteButton, stylesButtons.mainSlimConfig]} onPress={() => {setShowFilter(!showFilter)}}>
              {!showFilter ? 
              <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                <FontAwesome name="arrow-circle-down" size={34} color={darkBlueBackground} />
                <Text>{seeMoreLabel}</Text>
              </View>
              :
              <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                <FontAwesome name="arrow-circle-up" size={34} color={darkBlueBackground} />
                <Text>{closeLabel}</Text>
              </View>}
            </TouchableOpacity>
          </View>     
          <View style={[{flex: 1, margin: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
            <TextInput
            placeholder={searchLabel}
            value={searchValue}
            style={{ flex: 1, fontSize: 22, padding: '2%', marginHorizontal: '1%' }}
            onChangeText={(value) => {setSearchValue(value)}}
            />
            <TouchableOpacity style={[{flex: 0.2, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.navigateButton, stylesButtons.mainConfig]} onPress={search}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'search'} size={40} color="black"/> 
            </TouchableOpacity>
          </View>   
        </View>
        {showFilter ? 
        <View style={{flexDirection: 'row', marginVertical: '2%'}}>
          <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '2%'}, stylesButtons.mainConfig, allSelected]} onPress={() => {setSearchType(emptyValue); setButtonSelected(0)}}>
            <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold', marginTop: '5%'}}>{allLabel}</Text>
            <View style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center', marginTop: '5%'}}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'credit-card'} size={35} color="purple"/> 
              <Text style={{fontSize: 25}}>+</Text>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'person'} size={35} color="orange"/> 
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '2%'}, stylesButtons.mainConfig, cardsSelected]} onPress={() => {setSearchType('card'); setButtonSelected(1)}}>
            <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold', marginTop: '5%'}}>{cardsLabel}</Text>
            <MaterialIcons style={{marginHorizontal: '1%'}} name={'credit-card'} size={40} color="purple"/> 
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '2%'}, stylesButtons.mainConfig, loginsSelected]} onPress={() => {setSearchType('login'); setButtonSelected(2)}}>
            <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold', marginTop: '5%'}}>{loginLabel}</Text>
            <MaterialIcons style={{marginHorizontal: '1%'}} name={'person'} size={40} color="orange"/> 
          </TouchableOpacity>
        </View> : <></>}
        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '1%' }}/>
        <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '1%' }}/>
        {isFething ?
        <Spinner/> :
        <ScrollView>
          {credencials.map((value) => {
            if(value != undefined) {
              return <ScrollItem key={value.id} credential={value}/>
            }
          })}
        </ScrollView>}
      </View>
    </View>
  )
}

export default function Credentials() {
  return (    
    <>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, width: '100%'}}>
          <MainBox text={pageTitleCredentials}/>
          <AddCredencial/>
          <CredentialsList/>
        </View>
      </KeyboardAvoidingView>
        <Navbar/>
    </>
  )
}