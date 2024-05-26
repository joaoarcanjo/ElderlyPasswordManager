import React, { useState } from "react"
import { TouchableOpacity, View, Text, TextInput, StyleSheet, Alert } from "react-native"
import { stylesButtons } from "../../../assets/styles/main_style"
import { stylesAddCaregiver } from "../styles/styles"
import { ModalBox } from "../../../components/Modal"
import { modal, options } from "../../credential_interface/styles/styles"
import { startSessionWithCaregiver } from "./functions"
import { useSessionInfo } from "../../../firebase/authentication/session"
import { sessionRequestSent } from "../../../components/UserMessages"
import { deleteCaregiver, saveCaregiver } from "../../../database/caregivers"
import { CaregiverRequestStatus } from "../../../database/types"
import { ErrorInstance } from "../../../exceptions/error"
import { Errors } from "../../../exceptions/types"
import { addCaregiverLabel, cancelLabel, emptyValue, linkLabel } from "../../../assets/constants/constants"

export function AddCaregiverModal({visibility, concludeAction}: Readonly<{visibility: boolean, concludeAction: Function}>) {
  const [caregiverEmail, setCaregiverEmail] = useState(emptyValue)
  const { userId, userEmail, userName, userPhone } = useSessionInfo()

  const addCaregiver = async (email: string) => {
    if(email == userEmail) {
      Alert.alert("Erro", Errors.ERROR_USER_EMAIL)
    } else {
      await saveCaregiver(userId, emptyValue, emptyValue, email, emptyValue, CaregiverRequestStatus.WAITING)
      .then(() =>  startSessionWithCaregiver(email, userId, userName, userEmail, userPhone))
      .then(() => sessionRequestSent(email))
      .then(() => concludeAction())
      .catch(async (error) => {
        const errorAux = error as ErrorInstance
        if(errorAux.code === Errors.ERROR_CAREGIVER_ALREADY_ADDED.valueOf()) Alert.alert("Erro", errorAux.code)
        else {
          await deleteCaregiver(userId, email).then(() => Alert.alert("Erro", errorAux.code))
          .catch(() => console.log('#1 Error deleting caregiver'))
        }
      })    
    }
  }

  return (
    <ModalBox visibleFlag={visibility}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>{'Email do cuidador:'}</Text>
        <View style={[{marginBottom: '10%',flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2 }]}>
          <TextInput
            placeholder="Email"
            value={caregiverEmail} 
            autoFocus={true} 
            autoCapitalize="none"
            style={{ flex: 1, fontSize: 18, padding: '3%',  marginVertical: '1%' }}
            onChangeText={setCaregiverEmail}
          />
        </View> 
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: '3%' }}/>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {(caregiverEmail != emptyValue) && <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginRight: '3%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={() => addCaregiver(caregiverEmail)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>{linkLabel}</Text>
          </TouchableOpacity> }
          <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginLeft: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={() => {setCaregiverEmail(emptyValue); concludeAction()}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
    </ModalBox>
  )
}

export default function AddCaregiver({setRefresh}: Readonly<{setRefresh: Function}>) {

  const [modalVisible, setModalVisible] = useState(false)
  
  const buttonName = `${addCaregiverLabel} ` 

  const concludeAction = () => {
    setRefresh()
    setModalVisible(false)
  } 

  return (
    <View style={[{flex: 0.5, margin: '3%', justifyContent: 'center', alignItems: 'center'}]}>
      <View style= { { flex: 0.35, flexDirection: 'row', justifyContent: 'space-around'} }>
        <AddCaregiverModal concludeAction={concludeAction} visibility={modalVisible}/>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCaregiver.button, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>{buttonName}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}