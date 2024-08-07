import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard, Image} from 'react-native'
import { stylesAddCredential, styleScroolView, styleSearch } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import {Navbar} from '../../../navigation/actions'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import MainBox from '../../../components/MainBox'
import { Spinner } from '../../../components/LoadingComponents'
import { useSessionInfo } from '../../../context/session'
import { getAllCredentialsAndValidate, getAllCredentialsFromLocalDBFormattedWithFilter } from './functions'
import { addCredentialsLabel, allLabel, cardsLabel, closeLabel, emptyValue, filtersLabel, loginLabel, pageTitleCredentials, searchLabel, seeLessLabel } from '../../../assets/constants/constants'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { CredentialType } from './types'
import { ScrollItem } from './credentialItem'
import { getKeychainValueFor } from '../../../keychain'
import { caregiverFireKey } from '../../../keychain/constants'
import { darkGrey, cardColor, loginColor, dividerLineColorDark, arrowButtonTextColor, arrowColor, borderColorDark, color8, placeholderColor } from '../../../assets/styles/colors'
import { credencialsOptionsTextSize, credencialsSearchInputTextSize } from '../../../assets/styles/text'

function AddCredencial() {

  const { userId } = useSessionInfo()
  const navigation = useNavigation<StackNavigationProp<any>>()

  const navigateToAddCredential = async () => {
    Keyboard.dismiss()
    navigation.navigate('AddCredential', { userId: userId, key: await getKeychainValueFor(caregiverFireKey(userId)), isElderlyCredential: false })
  }
  return (
    <View style= { { flex: 0.1, marginTop: '5%', flexDirection: 'row'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '1%'}, stylesAddCredential.addCredentialButton, stylesButtons.mainConfig]} onPress={navigateToAddCredential}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{fontWeight: 'bold'}, stylesAddCredential.addCredentialButtonText]}>{addCredentialsLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

function CredentialsList() {

  const [credentials, setCredentials] = useState<(CredentialType | undefined)[]>([])
  const isFocused = useIsFocused()
  const { userId, localDBKey } = useSessionInfo()
  const [searchValue, setSearchValue] = useState(emptyValue)
  const [searchType, setSearchType] = useState(emptyValue)
  const [buttonSelected, setButtonSelected] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [isFething, setIsFething] = useState(true)

  const fetchCredentials = async () => {
    getAllCredentialsAndValidate(userId, await getKeychainValueFor(caregiverFireKey(userId)), localDBKey)
    .then((credentials) => setCredentials(credentials))
    search()
  }

  const search = ()=> {
    setIsFething(true)
    getAllCredentialsFromLocalDBFormattedWithFilter(userId, localDBKey, searchValue)
    .then((credentialsAux) => { 
      console.log("Local credentials: ", credentialsAux)  
      let auxCredentials: CredentialType[] = [];
      credentialsAux.forEach(value => {
        if(value && value.data && (value.data.platform.toLowerCase().includes(searchValue.toLowerCase()))) {
          if (value.data.type === 'login' && searchType === 'login') {
            auxCredentials.push({id: value.id, data: value.data})
          } else if (value.data.type === 'card' && searchType === 'card') {
            auxCredentials.push({id: value.id, data: value.data})
          } else if (searchType === emptyValue) {
            auxCredentials.push({id: value.id, data: value.data})
          }
        }
      })
      setCredentials(auxCredentials)
      setIsFething(false)
    })
  }

  useEffect(() => {
    setIsFething(true)
    fetchCredentials()
    .then(() => setIsFething(false))
  }, [isFocused])

  useEffect(() => search(), [searchType])

  const allSelected = buttonSelected === 0 ? styleSearch.optionButtonSelected : styleSearch.optionButtonNotSelected
  const cardsSelected = buttonSelected === 1 ? styleSearch.optionButtonSelected : styleSearch.optionButtonNotSelected
  const loginsSelected = buttonSelected === 2 ? styleSearch.optionButtonSelected : styleSearch.optionButtonNotSelected

  return (
    <View style={{ flex: 0.77, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginTop:'5%', marginHorizontal: '4%', justifyContent: 'space-around'}, styleScroolView.credentialsContainer]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.3, marginLeft: '2%', marginVertical: '1%'}}>
            <TouchableOpacity style={[{flex: 1, justifyContent: 'center',  alignItems: 'center'}, stylesButtons.moreInfoButton, stylesButtons.mainSlimConfig]} onPress={() => {setShowFilter(!showFilter)}}>
              {!showFilter ? 
              <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                <FontAwesome name="chevron-down" size={34} color={arrowColor} />
                <Text style={{color: arrowButtonTextColor}}>{filtersLabel}</Text>
              </View>
              :
              <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                <FontAwesome name="chevron-up" size={34} color={arrowColor} />
                <Text style={{color: arrowButtonTextColor}}>{seeLessLabel}</Text>
              </View>}
            </TouchableOpacity>
          </View>           
          <View style={[{flex: 1, margin: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8, borderColor: borderColorDark }]}>
            <TextInput
            placeholder={searchLabel}
            placeholderTextColor={placeholderColor}
            value={searchValue}
            style={{ flex: 1, fontSize: credencialsSearchInputTextSize, padding: '2%', marginHorizontal: '1%' }}
            onChangeText={(value) => {setSearchValue(value)}}
            />
            <TouchableOpacity style={[{flex: 0.2, marginHorizontal: '2%', marginVertical: '2%'}, styleSearch.button, stylesButtons.mainConfig]} onPress={search}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'search'} size={40} color={darkGrey}/> 
            </TouchableOpacity>
          </View>   
        </View>
        {showFilter ? 
        <View style={{flexDirection: 'row', marginVertical: '2%'}}>
          <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '2%'}, stylesButtons.mainConfig, allSelected]} onPress={() => {setSearchType(emptyValue); setButtonSelected(0)}}>
            <Text style={{fontSize: credencialsOptionsTextSize, color: darkGrey, fontWeight: 'bold', marginTop: '5%'}}>{allLabel}</Text>
            <View style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center', marginTop: '5%'}}>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'credit-card'} size={35} color={cardColor}/> 
              <Text style={{fontSize: credencialsOptionsTextSize}}>+</Text>
              <MaterialIcons style={{marginHorizontal: '1%'}} name={'person'} size={35} color={loginColor}/> 
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '2%'}, stylesButtons.mainConfig, cardsSelected]} onPress={() => {setSearchType('card'); setButtonSelected(1)}}>
            <Text style={{fontSize: credencialsOptionsTextSize, color: darkGrey, fontWeight: 'bold', marginTop: '5%'}}>{cardsLabel}</Text>
            <MaterialIcons style={{marginHorizontal: '1%'}} name={'credit-card'} size={40} color={cardColor}/> 
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '2%'}, stylesButtons.mainConfig, loginsSelected]} onPress={() => {setSearchType('login'); setButtonSelected(2)}}>
          <Text style={{fontSize: credencialsOptionsTextSize, color: darkGrey, fontWeight: 'bold', marginTop: '5%'}}>{loginLabel}</Text>
            <MaterialIcons style={{marginHorizontal: '1%'}} name={'person'} size={40} color={loginColor}/> 
          </TouchableOpacity>
        </View> : <></>}
        <View style={{ height: 1, backgroundColor: dividerLineColorDark, marginVertical: '2%' }}/>
        {isFething ?
        <Spinner width={300} height={300}/> :
        <ScrollView>
          {credentials.map((value: CredentialType | undefined) => {
            if(value != undefined) {
              return <ScrollItem key={value.id} credential={value} elderlyId={emptyValue}/>
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