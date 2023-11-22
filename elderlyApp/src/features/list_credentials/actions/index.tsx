import React from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native'
import { stylesAddCredential, styleScroolView } from '../styles/styles'
import { stylesButtons, stylesMainBox } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'

function MainBox() {

  return (
    <View style= { { flex: 0.15, flexDirection: 'row'} }>
        <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesMainBox.pageInfoText]}>Credenciais</Text>
        </View>
    </View>
  )
}

function AddCredencial() {
  return (
    <View style= { { flex: 0.10, flexDirection: 'row'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.addCredentialButton, stylesButtons.mainConfig]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.addCredentialButtonText]}>ADICIONAR CREDENCIAIS</Text>
      </TouchableOpacity>
    </View>
  )
}

function ScrollItemExample() {
  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>
      <View style={{flex: 0.35, margin: '3%', flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('../images/instagram_icon.png')} style={[{width: '20%', height: 50, marginRight: '5%', resizeMode: 'contain'}]}/>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 30, fontWeight: 'bold' }]}>Instagram</Text>
      </View>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginBottom: '3%', flexDirection: 'row'}}>

        <View style={{flex: 0.65, marginRight: '3%'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, styleScroolView.itemCopyUsername, stylesButtons.mainConfig]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar utilizador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '2%'}, styleScroolView.itemCopyPassword, stylesButtons.mainConfig]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Copiar Password</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 0.35}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.itemMoreInfoButton, stylesButtons.mainConfig]}>
              <Image source={require('../../../assets/images/more_info.png')} style={[{width: '60%', height: 60, marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}


function CredentialsList() {
  return (
    <View style={{ flex: 0.70, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, flexDirection: 'row', marginTop:'5%', marginHorizontal: '4%', justifyContent: 'space-around'}, styleScroolView.credencialsContainer]}>
        <ScrollView style={[{margin: '3%'}]}>
          <ScrollItemExample/>
          <ScrollItemExample/>
          <ScrollItemExample/>
          <ScrollItemExample/>
        </ScrollView>
      </View>
    </View>
  )
}

export default function Credentials({ navigation }: {readonly navigation: any}) {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <AddCredencial/>
      <CredentialsList/>
      <Navbar navigation={navigation}/>
    </View>
  )
}