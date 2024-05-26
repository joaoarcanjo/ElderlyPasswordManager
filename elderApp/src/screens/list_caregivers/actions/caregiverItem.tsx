import React, { useState } from "react"
import { TouchableOpacity, View, Text, Image, StyleSheet, Linking } from "react-native"
import { Switch } from 'react-native-switch'
import { stylesButtons } from "../../../assets/styles/main_style"
import { caregiverContactInfo, caregiverStyle, decouplingOption, newCaregiverContainer, permission } from "../styles/styles"
import { acceptCaregiver, decouplingCaregiver, refuseCaregiver } from "./functions"
import { YesOrNoModal } from "../../../components/Modal"
import { addCaregiverToArray, removeCaregiverFromArray } from "../../../firebase/firestore/functionalities"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../firebase/authentication/session"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"
import { startSession } from "../../../e2e/session/functions"
import { CaregiverRequestStatus } from "../../../database/types"
import { acceptLabel, cancelLabel, emptyValue, noOption, refuseLabel, unlinkLabel, writeCaregivers, yesOption } from "../../../assets/constants/constants"
import { cancelWaitingCaregiver } from "../../../e2e/messages/functions"
import { encryptAndSendMessage } from "../../../e2e/messages/sendMessage"
import { setCaregiverListUpdated } from "./state"
import { darkGreenBackgroud, darkRedBackground, dividerLineColor, lightGreenBackgroud, lightRedBackground } from "../../../assets/styles/colors"

const caregiverImage = '../../../assets/images/caregiver.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'

function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {
  const [aux, setAux] = useState(value)

  return (
    <View style={[{flex: 0.33, flexDirection: 'row', alignItems: 'center', marginHorizontal: '5%', marginTop: '4%', marginBottom: '2%'}]}>
      <View style={{flex: 0.6, marginRight: '5%', justifyContent: 'center', alignItems: 'center'}}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[permission.questionText]}>{name}</Text>
      </View>
      <View style={[{flex: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
        <Switch
          value={aux}
          onValueChange={(val) => {setAux(val); func()}}
          disabled={false}
          activeText={yesOption}
          inActiveText={noOption}
          circleSize={37}
          backgroundActive={lightGreenBackgroud}
          backgroundInactive={lightRedBackground}
          circleActiveColor={darkGreenBackgroud}
          activeTextStyle={permission.yesButtonText}
          inactiveTextStyle={permission.noButtonText}
          circleInActiveColor={darkRedBackground}/>
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
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginHorizontal: '5%', fontWeight: 'bold' }]}>{`Pedido recebido de: ${email}`}</Text>
          <View style={{ height: 1, backgroundColor: dividerLineColor, marginVertical: '3%' }}/>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: 18 }, caregiverStyle.newCaregiverText]}>{`O idoso ${name} com o email ${email} enviou-lhe um pedido!`}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: dividerLineColor, marginVertical: '3%' }}/>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.acceptButton, stylesButtons.mainConfig]} onPress={accept}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newCaregiverContainer.buttonText]}>{acceptLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.rejectButton, stylesButtons.mainConfig]} onPress={refuse}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newCaregiverContainer.buttonText]}>{refuseLabel}</Text>
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
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginHorizontal: '5%', fontWeight: 'bold' }]}>{`Pedido enviado para: ${caregiverEmail}`}</Text>
          <View style={{ height: 1, backgroundColor: dividerLineColor, marginVertical: '3%' }}/>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 18 }}>{`À espera que o cuidador com o email ${caregiverEmail} aceite o seu pedido.`}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: dividerLineColor, marginVertical: '3%' }}/>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.cancelButton, stylesButtons.mainConfig]} onPress={cancel}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newCaregiverContainer.buttonText]}>{cancelLabel}</Text>
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

  const deleteCaregiver = () => {
    decouplingCaregiver(email, caregiverId, userId)
    .then(() => setModalVisible(false))
    .then(() => setRefresh())
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
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginTop: '5%' }]}>{name}</Text>
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
        <Requirement name={'Altera credenciais?:'} value={writePermission} func={writeFunction} />
      </View>
      <YesOrNoModal question={'Concluir desvinculação?'} yesFunction={deleteCaregiver} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
    </View>
  )
}