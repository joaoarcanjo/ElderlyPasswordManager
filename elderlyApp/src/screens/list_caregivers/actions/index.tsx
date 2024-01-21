import React from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet, Linking} from 'react-native'
import { stylesAddCaregiver, caregiverStyle, caregiverContactInfo, decouplingOption, permissionButton } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

const caregiverImage = '../../../assets/images/caregiver.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'

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
          <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]} onPress={() => Linking.openURL(`tel:${966666666}`) }>
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
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>VINCULAR CUIDADOR 2</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function CaregiversList() {

  const navigation = useNavigation<StackNavigationProp<any>>()
  
  const permissions = () => {
    navigation.navigate('Permissions')
  }

  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <CaregiverItem/>
        <CaregiverItemNotIncluded/>
        <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '20%'}, permissionButton.permissionButton, stylesButtons.mainConfig]} onPress={permissions}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[permissionButton.permissionButtonText]}>Permissões</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

//TODO: construir um main componente para ter receber apenas os components childs de cada page
export default function Caregivers() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Cuidadores'}/>
      <CaregiversList/>
      <Navbar/>
    </View>
  )
}