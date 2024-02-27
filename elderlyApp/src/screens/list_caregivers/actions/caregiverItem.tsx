import React, { useState } from "react"
import { TouchableOpacity, View, Text, Image, StyleSheet, Linking } from "react-native"
import { stylesButtons } from "../../../assets/styles/main_style"
import { caregiverContactInfo, caregiverStyle, decouplingOption } from "../styles/styles"
import { decouplingCaregiver } from "./functions"
import { YesOrNoModal, YesOrNoSpinnerModal } from "../../../components/Modal"

const caregiverImage = '../../../assets/images/caregiver.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'

export default function CaregiverItem({name, phone, email, setRefresh}: Readonly<{name: string, phone: string, email: string, setRefresh: Function}>) {

  const [modalVisible, setModalVisible] = useState(false)

  const deleteCaregiver = () => {
    decouplingCaregiver(email).then(() => setRefresh())
  }
  
  return (
    <View style={[{flex: 0.5, margin: '3%'}, caregiverStyle.container]}>
      <View style={{flex: 0.45, margin: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 0.5, marginTop: '5%', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require(caregiverImage)} style={[{width: '50%', height: '70%', marginHorizontal: '4%', resizeMode: 'contain'}]}/>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginTop: '5%' }]}>{name}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, decouplingOption.button, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '10%' }, decouplingOption.buttonText]}>Desvincular</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.65, marginBottom:'3%'}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }}/>
          <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]} onPress={() => Linking.openURL(`tel:${966666666}`) }>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>{phone}</Text>
            <Image source={require(telephoneImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
          <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]}  onPress={() => Linking.openURL('mailto:support@example.com')}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>{email}</Text>
            <Image source={require(emailImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
      </View>
      <YesOrNoModal question={'Concluir desvinculação?'} yesFunction={deleteCaregiver} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
    </View>
  )
}