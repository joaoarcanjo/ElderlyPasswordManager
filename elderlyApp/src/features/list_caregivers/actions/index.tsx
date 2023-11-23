import React,{useState} from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet, Linking} from 'react-native'
import { stylesAddCaregiver, caregiverStyle, caregiverContactInfo, decouplingOption } from '../styles/styles'
import { stylesButtons, stylesMainBox } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'

const caregiverImage = '../../../assets/images/caregiver.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'

function MainBox() {

  return (
    <View style= { { flex: 0.15, flexDirection: 'row'} }>
        <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesMainBox.pageInfoText]}>Cuidadores</Text>
        </View>
    </View>
  )
}

function CaregiverItem() {

  return (
    <View style={[{flex: 0.5, margin: '3%'}, caregiverStyle.container]}>
      <View style={{flex: 0.45, margin: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 0.5, marginTop: '5%', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require(caregiverImage)} style={[{width: '50%', height: '70%', marginHorizontal: '4%', resizeMode: 'contain'}]}/>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginTop: '5%' }]}>Elisabeth</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, decouplingOption.button, stylesButtons.mainConfig]} onPress={() => {}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '10%' }, decouplingOption.buttonText]}>Desvincular</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.65, marginBottom:'3%'}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }}/>
          <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]} onPress={() => Linking.openURL(`tel:${965536775}`) }>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>+351 965537775</Text>
            <Image source={require(telephoneImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
          <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]}  onPress={() => Linking.openURL('mailto:support@example.com')}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>joaopedro.arcanjo@hotmail.com</Text>
            <Image source={require(emailImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
      </View>
    </View>
  )
}

function CaregiverItemNotIncluded() {

  return (
    <View style={[{flex: 0.5, margin: '3%', justifyContent: 'center', alignItems: 'center'}]}>
      <View style= { { flex: 0.35, flexDirection: 'row', justifyContent: 'space-around'} }>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCaregiver.button, stylesButtons.mainConfig]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>VINCULAR CUIDADOR</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function CaregiversList() {
  return (
    <View style={{ flex: 0.85, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <CaregiverItem/>
        <CaregiverItemNotIncluded/>
      </View>
    </View>
  )
}

//TODO: construir um main componente para ter receber apenas os components childs de cada page
export default function Caregivers({ navigation }: {readonly navigation: any}) {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox/>
      <CaregiversList/>
      <Navbar/>
    </View>
  )
}