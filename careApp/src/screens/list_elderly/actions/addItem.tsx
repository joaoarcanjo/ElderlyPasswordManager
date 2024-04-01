import React, { useState } from "react"
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native"
import { stylesButtons } from "../../../assets/styles/main_style"
import { stylesAddCaregiver } from "../styles/styles"
import { ModalBox } from "../../../components/Modal"
import { modal, options } from "../../credential_interface/styles/styles"
import { useSessionInfo } from "../../../firebase/authentication/session"
import { startSessionWithElderly } from "./functions"
import { ElderlyRequestStatus } from "../../../database/types"
import { ErrorInstance } from "../../../exceptions/error"
import { Errors } from "../../../exceptions/types"
import { deleteElderly, saveElderly } from "../../../database/elderlyFunctions"
import { addElderlyLabel, cancelLabel, elderlyEmailLabel, emailPlaceholder, linkLabel } from "../../../assets/constants"
import { sessionRequestSent } from "../../../components/userMessages/UserMessages"

export function AddElderlyModal({visibility, concludeAction}: Readonly<{visibility: boolean, concludeAction: Function}>) {

  const [elderlyEmail, setElderlyEmail] = useState('')
  const { userId, userEmail, userName, userPhone } = useSessionInfo()

  const addElderly = async (email: string) => {
    saveElderly(userId, '0', '0', email, '0', ElderlyRequestStatus.WAITING)
    .then(() => startSessionWithElderly(email, userId, userName, userEmail, userPhone))
    .then(() => sessionRequestSent(elderlyEmail))
    .then(() => concludeAction())
    .catch((error) => {
      const errorAux = error as ErrorInstance
      if(errorAux.code === Errors.ERROR_ELDERLY_ALREADY_ADDED.valueOf()) alert(errorAux.code)
      else deleteElderly(userId, email).then(() => alert(errorAux.code))
    })
  }

  return (
    <ModalBox visibleFlag={visibility}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>{elderlyEmailLabel}</Text>
        <View style={[{marginBottom: '10%',flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2 }]}>
          <TextInput
            placeholder={emailPlaceholder}
            value={elderlyEmail} 
            autoFocus={true} 
            autoCapitalize="none"
            style={{ flex: 1, fontSize: 18, padding: '3%',  marginVertical: '1%' }}
            onChangeText={setElderlyEmail}
          />
        </View> 
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: '3%' }}/>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {(elderlyEmail != '') && <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginRight: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => addElderly(elderlyEmail)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>{linkLabel}</Text>
          </TouchableOpacity> }
          <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginLeft: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => {setElderlyEmail(''); concludeAction()}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
    </ModalBox>
  )
}

export default function AddElderly({setRefresh}: Readonly<{setRefresh: Function}>) {

  const [modalVisible, setModalVisible] = useState(false)

  const concludeAction = () => {
    setRefresh()
    setModalVisible(false)
  } 

  return (
    <View style={[{flex: 0.15, margin: '1%', justifyContent: 'center', alignItems: 'center'}]}>
      <View style= { { flex: 1, flexDirection: 'row', justifyContent: 'space-around'} }>
        <AddElderlyModal concludeAction={concludeAction} visibility={modalVisible}/>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCaregiver.button, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>{addElderlyLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}