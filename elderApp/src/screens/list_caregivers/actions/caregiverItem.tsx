import React, { useState } from "react"
import { TouchableOpacity, View, Text, Image, StyleSheet, Linking } from "react-native"
import { Switch } from 'react-native-switch'
import { stylesButtons } from "../../../assets/styles/main_style"
import { caregiverContactInfo, caregiverStyle, decouplingOption, newCaregiverContainer, permission } from "../styles/styles"
import { acceptCaregiver, decouplingCaregiver, refuseCaregiver } from "./functions"
import { YesOrNoModal } from "../../../components/Modal"
import { addCaregiverToArray, removeCaregiverFromArray } from "../../../firebase/firestore/functionalities"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../context/session"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"
import { startSession } from "../../../e2e/session/functions"
import { CaregiverRequestStatus } from "../../../database/types"
import { acceptLabel, cancelLabel, emptyValue, refuseLabel, unlinkLabel, writeCaregivers } from "../../../assets/constants/constants"
import { cancelWaitingCaregiver } from "../../../e2e/messages/functions"
import { encryptAndSendMessage } from "../../../e2e/messages/sendMessage"
import { setCaregiverListUpdated } from "./state"
import { color7, color8, dividerLineColorDark, dividerLineColorLight, greenBackground, greenBorder, redBackground, redBorder } from "../../../assets/styles/colors"
import { options } from "../../credential_interface/styles/styles"
import { buttonNormalTextSize, caregiverDescriptionTextSize, caregiverTitleTextSize } from "../../../assets/styles/text"

const caregiverImage = '../../../assets/images/caregiver.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'

function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {

  return (
    <View style={[{flex: 0.4, flexDirection: 'row', alignItems: 'center', marginHorizontal: '5%', marginTop: '4%', marginBottom: '2%'}]}>
      <View style={{flex: 0.7, marginRight: '5%', justifyContent: 'center', alignItems: 'center'}}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={[permission.questionText]}>{name}</Text>
      </View>
      <View style={[{flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
        <Switch
          value={value}
          onValueChange={() => func()}
          activeText={'On'}
          inActiveText={'Off'}
          circleSize={40}
          barHeight={40}
          circleBorderWidth={3}
          backgroundActive={color7}
          backgroundInactive={color7}
          circleActiveColor={greenBorder}
          circleInActiveColor={redBorder}
          changeValueImmediately={false} // if rendering inside circle, change state immediately or wait for animation to complete
          renderActiveText={false}
          renderInActiveText={false}
        />
      </View>
    </View>
  )
}

export function CaregiverItem({number, caregiverId, name, phone, email, setRefresh, status, canWrite}: Readonly<{number: number, caregiverId: string, name: string, phone: string, email: string, setRefresh: Function, status: number, canWrite: boolean}>) {
  if(status == CaregiverRequestStatus.RECEIVED) {
    return <CaregiverToBeAccepted caregiverId={caregiverId} number={number} name={name} email={email} setRefresh={setRefresh}/>
  } else if (status == CaregiverRequestStatus.ACCEPTED) {
    return <Caregiver name={name} phone={phone} email={email} caregiverId={caregiverId} setRefresh={setRefresh} canWrite={canWrite}/>
  } else if (status == CaregiverRequestStatus.WAITING) {
    return <CaregiverWaiting caregiverEmail={email} setRefresh={setRefresh} />
  } else {
    //Nada por agora.
  }
}

export function CaregiverToBeAccepted({ caregiverId, number, name, email, setRefresh }: Readonly<{caregiverId: string, number: number, name: string, email: string, setRefresh: Function}>) {

  const { userId, userEmail, userName, userPhone } = useSessionInfo()
  
  const accept = () => acceptCaregiver(caregiverId, number, userId, email, userName, userEmail, userPhone).then(() => setRefresh()) 
  const refuse = () => refuseCaregiver(userId, email, name).then(() => setRefresh()) 

  return (
    <View style={{flex: 0.55, justifyContent: 'center', alignItems: 'center'}}>
       <View style={[{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }, caregiverStyle.newCaregiverContainer]}>
        <View style={{ flex: 1, marginTop: '4%' }}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: caregiverTitleTextSize, marginHorizontal: '3%', fontWeight: 'bold' }]}>{`Pedido recebido de: ${email}`}</Text>

          <View style={{ height: 2, backgroundColor: dividerLineColorDark, marginVertical: '4%' }}/>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={3} adjustsFontSizeToFit style={[{ fontSize: caregiverDescriptionTextSize }]}>{`O cuidador ${name} com o email ${email} enviou-lhe um pedido!`}</Text>
          </View>
          <View style={{ height: 2, backgroundColor: dividerLineColorDark, marginVertical: '2%' }}/>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.acceptButton, stylesButtons.mainConfig]} onPress={accept}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, marginVertical: '5%' }, newCaregiverContainer.buttonText]}>{acceptLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.rejectButton, stylesButtons.mainConfig]} onPress={refuse}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, marginVertical: '5%' }, newCaregiverContainer.buttonText]}>{refuseLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export function CaregiverWaiting({caregiverEmail, setRefresh}: Readonly<{ caregiverEmail: string,  setRefresh: Function}>) {
  
  const { userId } = useSessionInfo()
  const cancel = () => cancelWaitingCaregiver(userId, caregiverEmail).then(() => setRefresh()) 

  return (
    <View style={{flex: 0.55, justifyContent: 'center', alignItems: 'center'}}>
      <View style={[{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }, caregiverStyle.sentRequestCaregiverContainer]}>
        <View style={{ flex: 1, marginTop: '4%' }}>
          <Text numberOfLines={2} style={[{ fontSize: caregiverTitleTextSize, marginHorizontal: '3%', fontWeight: 'bold' }]}>{`Pedido enviado para: ${caregiverEmail}`}</Text>
          <View style={{ height: 2, backgroundColor: dividerLineColorDark, marginVertical: '2%' }}/>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={3} adjustsFontSizeToFit style={{ fontSize: caregiverDescriptionTextSize }}>{`À espera que o cuidador com o email ${caregiverEmail} aceite o seu pedido.`}</Text>
          </View>
          <View style={{height: 1, marginVertical: '3%', marginHorizontal: '3%' }}/>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.cancelButton, stylesButtons.mainConfig]} onPress={cancel}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, marginVertical: '5%' }, options.cancelLabelText]}>{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export function Caregiver({name, phone, email, caregiverId, setRefresh, canWrite}: Readonly<{name: string, phone: string, email: string, caregiverId: string, setRefresh: Function, canWrite: boolean}>) {

  const [modalVisible, setModalVisible] = useState(false)
  const [writePermission, setWritePermission] = useState(canWrite)
  const { userId } = useSessionInfo()
  const [isLoading, setLoading] = useState(false)

  const deleteCaregiver = () => {
    setLoading(true)
    decouplingCaregiver(email, caregiverId, userId)
    .then(() => setModalVisible(false))
    .then(() => setRefresh())
    .finally(() => setLoading(false))
  }

  const writeFunction = async () => {
    const result = !writePermission ? await addCaregiverToArray(userId, caregiverId, writeCaregivers) : await removeCaregiverFromArray(userId, caregiverId, writeCaregivers)
    if (result) {
      setWritePermission(!writePermission)

      if(!sessionForRemoteUser(email)) {
          await startSession(email)
          const session = sessionForRemoteUser(email)
          currentSessionSubject.next(session ?? null)
      }
      await encryptAndSendMessage(email, emptyValue, false, ChatMessageType.PERMISSION_DATA) 
      await setCaregiverListUpdated(userId)
    }
  }
  
  return (
    <View style={[{flex: 0.55, margin: '1%'}, caregiverStyle.container]}>
      <View style={{flex: 0.45, margin: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 0.5, marginTop: '5%', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require(caregiverImage)} style={[{width: '50%', height: '70%', marginHorizontal: '4%', resizeMode: 'contain'}]}/>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: caregiverDescriptionTextSize, marginTop: '5%', fontWeight: 'bold' }]}>{name}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%', height: '80%'}, decouplingOption.button, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[decouplingOption.buttonText]}>{unlinkLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }}/>
        <TouchableOpacity style={[{ flex: 0.33, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]} onPress={() => Linking.openURL(`tel:${phone}`) }>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>{phone}</Text>
          <Image source={require(telephoneImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[{ flex: 0.33, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, caregiverContactInfo.accountInfo, stylesButtons.mainConfig]}  onPress={() => Linking.openURL(`mailto:${email}`)}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, caregiverContactInfo.accountInfoText]}>{email}</Text>
          <Image source={require(emailImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        <Requirement name={'Pode alterar as suas credenciais?:'} value={writePermission} func={writeFunction} />
      </View>
      <YesOrNoModal question={`Deseja concluir a desvinculação do cuidador ${name}?`} yesFunction={deleteCaregiver} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible} isLoading={isLoading}/>
    </View>
  )
}