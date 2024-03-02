import React, { useState } from "react"
import { TouchableOpacity, View, Text, Image, StyleSheet, Linking } from "react-native"
import { stylesButtons } from "../../../assets/styles/main_style"
import { caregiverContactInfo, caregiverStyle, decouplingOption, permission } from "../styles/styles"
import { decouplingCaregiver } from "./functions"
import { YesOrNoModal } from "../../../components/Modal"
import { addCaregiverToArray, removeCaregiverFromArray } from "../../../firebase/firestore/functionalities"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../firebase/authentication/session"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"
import { startSession } from "../../../e2e/session/functions"

const caregiverImage = '../../../assets/images/caregiver.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'
const crossImage = "../../../assets/images/cross.png"
const checkImage = "../../../assets/images/check.png"

function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {
  return (
    <TouchableOpacity style={[{ flex: 0.33, flexDirection: 'row', marginHorizontal: '4%'}]} onPress={() => func()}>
      <View style={[{flex: 1}, permission.container, stylesButtons.mainConfig]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{}, permission.text]}>{name}</Text>
      </View>
      {value ? 
      <Image source={require(checkImage)} style={[{flex: 0.2, height: '100%', marginRight: '1%', resizeMode: 'contain'}]}/>:
      <Image source={require(crossImage)} style={[{flex: 0.2, height: '100%', marginRight: '1%', resizeMode: 'contain'}]}/>}
    </TouchableOpacity>
  )
}

export default function CaregiverItem({name, phone, email, id, setRefresh, canWrite}: Readonly<{name: string, phone: string, email: string, id: string, setRefresh: Function, canWrite: boolean}>) {

  const [modalVisible, setModalVisible] = useState(false)
  const [writePermission, setWritePermission] = useState(canWrite)
  const { userId } = useSessionInfo()

  const deleteCaregiver = () => {
    decouplingCaregiver(email).then(() => setRefresh())
  }

  const writeFunction = async () => {
    console.log(!writePermission)
    const result = !writePermission ? await addCaregiverToArray(userId, id, 'writeCaregivers') : await removeCaregiverFromArray(userId, id, 'writeCaregivers')
    if (result) {
      setWritePermission(!writePermission)

      if(!sessionForRemoteUser(email)) {
          await startSession(email)
          const session = sessionForRemoteUser(email)
          currentSessionSubject.next(session ?? null)
      }
      await encryptAndSendMessage(email, '', false, ChatMessageType.PERMISSION_DATA) 
    }
  }
  
  return (
    <View style={[{flex: 0.55, margin: '1%'}, caregiverStyle.container]}>
      <View style={{flex: 0.45, margin: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 0.5, marginTop: '5%', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require(caregiverImage)} style={[{width: '50%', height: '70%', marginHorizontal: '4%', resizeMode: 'contain'}]}/>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginTop: '5%' }]}>{name}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, decouplingOption.button, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '10%' }, decouplingOption.buttonText]}>Desvincular</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, marginBottom:'3%'}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }}/>
          <TouchableOpacity style={[{ flex: 0.33, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]} onPress={() => Linking.openURL(`tel:${966666666}`) }>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>{phone}</Text>
            <Image source={require(telephoneImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
          <TouchableOpacity style={[{ flex: 0.33, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]}  onPress={() => Linking.openURL('mailto:support@example.com')}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>{email}</Text>
            <Image source={require(emailImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }}/>
        <Requirement name={'Alterar credenciais'} value={writePermission} func={writeFunction} />
      </View>
      <YesOrNoModal question={'Concluir desvinculação?'} yesFunction={deleteCaregiver} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
    </View>
  )
}