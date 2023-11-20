import React,{Component, useState} from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Linking} from 'react-native'
import { stylesAddCaregiver, styleScroolView, caregiverContactInfo, decouplingOption } from '../styles/styles'
import { stylesButtons, stylesMainBox } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'

function MainBox() {

  return (
    <View style= { { flex: 0.15, flexDirection: 'row', justifyContent: 'space-around'} }>
        <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesMainBox.pageInfoText]}>Cuidadores</Text>
        </View>
    </View>
  )
}

function AddCaregiver() {
  return (
    <View style= { { flex: 0.10, flexDirection: 'row', justifyContent: 'space-around'} }>
      <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}, stylesAddCaregiver.addCaregiverButton]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.addCaregiverButtonText]}>VINCULAR CUIDADOR</Text>
      </TouchableOpacity>
    </View>
  )
}

function CaregiverContacts() {
  
  return (
    <View style={{marginBottom:'3%'}}>
      <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
      <View>
        <View style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%', marginVertical: '3%'}, caregiverContactInfo.accountInfoText]}>+351 965537775</Text>
          <Image source={require('../../../assets/images/telephone.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: '6%'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%', justifyContent: 'center',  alignItems: 'center'}, stylesButtons.copyButton]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '3%' }]}>Copiar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%', justifyContent: 'center',  alignItems: 'center'}, caregiverContactInfo.callButton]} onPress={() => Linking.openURL(`tel:${965536775}`) }>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '3%' }]}>Telefonar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%', marginVertical: '5%'}, caregiverContactInfo.accountInfoText]}>joaopedro.arcanjo@hotmail.com</Text>
          <Image source={require('../../../assets/images/email.png')} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: '6%'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%', justifyContent: 'center',  alignItems: 'center'}, stylesButtons.copyButton]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '3%' }]}>Copiar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%', justifyContent: 'center',  alignItems: 'center'}, caregiverContactInfo.sendEmailButton]} onPress={() => Linking.openURL('mailto:support@example.com') }>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '3%' }]}>Enviar Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

function DecouplingCaregiver() {
  return (
    <View style={{marginBottom:'3%'}}>
      <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
      <View>
        <View style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', marginHorizontal: '4%'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '3%'}, decouplingOption.decouplingMessage]}>Realizar desvinculação?</Text>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: '6%'}}>
          <TouchableOpacity style={[{flex: 0.4, margin: '3%', justifyContent: 'center',  alignItems: 'center'}, decouplingOption.yesButton]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '3%' }, decouplingOption.optionText]}>SIM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.6, margin: '3%', justifyContent: 'center',  alignItems: 'center'}, decouplingOption.noButton]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '3%' }, decouplingOption.optionText]}>NÃO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

function CaregiverItem() {
  
  const [option, setOption] = useState('');

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>
      <View style={{flex: 0.25, margin: '5%', flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('../../../assets/images/caregiver.png')} style={[{width: 100, height: 100, marginHorizontal: '8%', resizeMode: 'contain'}]}/>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 25, alignItems: 'flex-end', justifyContent: 'flex-end' }]}>Elisabeth</Text>
      </View>

      <View style={{flex: 0.75, marginHorizontal: '3%', marginBottom: '3%'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%', justifyContent: 'center',  alignItems: 'center', flexDirection: 'row'}, styleScroolView.button]} onPress={() => {setOption('contacts')}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Contactos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%', justifyContent: 'center',  alignItems: 'center'}, styleScroolView.button]} onPress={() => {setOption('decoupling')}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>Desvincular</Text>
          </TouchableOpacity>
        </View>
      </View>
      {option === 'contacts' ? <CaregiverContacts/>: <></>}
      {option === 'decoupling' ? <DecouplingCaregiver/>: <></>}
      {option === ''? <></> : 
      <TouchableOpacity style={[{margin: '3%', marginHorizontal: '30%', alignItems: 'center'}, styleScroolView.button]} onPress={() => setOption('')}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '1%' }]}>Fechar</Text>
      </TouchableOpacity>}
    </View>
  )
}


function CaregiversList() {
  return (
    <View style={{ flex: 0.70, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, flexDirection: 'row', marginTop:'5%', marginHorizontal: '4%', justifyContent: 'space-around'}, styleScroolView.caregiversContainer]}>
        <ScrollView style={[{margin: '3%'}]}>
          <CaregiverItem/>
          <CaregiverItem/>
        </ScrollView>
      </View>
    </View>
  )
}

export default function Caregivers({ navigation }: {readonly navigation: any}) {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <AddCaregiver/>
      <CaregiversList/>
      <Navbar navigation={navigation}/>
    </View>
  )
}