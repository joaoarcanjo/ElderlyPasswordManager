import React, { useState } from "react"
import { TouchableOpacity, View, Text, TextInput, StyleSheet, Alert } from "react-native"
import { stylesButtons } from "../../../assets/styles/main_style"
import { stylesAddCaregiver } from "../styles/styles"
import { ModalBox } from "../../../components/Modal"
import { modal, options } from "../../credential_interface/styles/styles"
import { startSessionWithCaregiver } from "./functions"
import { useSessionInfo } from "../../../context/session"
import { deleteCaregiver, saveCaregiver } from "../../../database/caregivers"
import { CaregiverRequestStatus } from "../../../database/types"
import { ErrorInstance } from "../../../exceptions/error"
import { Errors } from "../../../exceptions/types"
import { addCaregiverLabel, cancelLabel, emptyValue, linkLabel } from "../../../assets/constants/constants"
import { sessionRequestSent } from "../../../notifications/UserMessages"
import { Spinner } from "../../../components/LoadingComponents"
import { credencialCardInputTextSize } from "../../../assets/styles/text"

export function AddCaregiverModal({visibility, concludeAction}: Readonly<{visibility: boolean, concludeAction: Function}>) {
  const [caregiverEmail, setCaregiverEmail] = useState(emptyValue)
  const { userId, userEmail, userName, userPhone } = useSessionInfo()
  const [isLoading, setLoading] = useState(false)

  const addCaregiver = async (email: string) => {
    if(email == userEmail) {
      Alert.alert("Erro", Errors.ERROR_USER_EMAIL)
    } else {
      setLoading(true)
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
      .finally(() => setLoading(false))
    }
  }

  const message = isLoading ? `A enviar pedido a: ${caregiverEmail}` : 'Email do cuidador:'

  return (
    <ModalBox visibleFlag={visibility}>
      <Text numberOfLines={3} adjustsFontSizeToFit style={modal.modalText}>{message}</Text>
      {!isLoading ?
      <View style={{width: '100%'}}>
        <View style={[{width: '100%',marginBottom: '10%',flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2 }]}>
          <TextInput
            placeholder="Email"
            value={caregiverEmail} 
            autoFocus={true} 
            autoCapitalize="none"
            style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '3%',  marginVertical: '1%' }}
            onChangeText={setCaregiverEmail}
          />
        </View> 
        <View style={{alignItems: "center", flexDirection: 'row', justifyContent: 'center'}}>
          {(caregiverEmail != emptyValue) && <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginRight: '3%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={() => addCaregiver(caregiverEmail)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.linkLabelText]}>{linkLabel}</Text>
          </TouchableOpacity> }
          <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginLeft: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={() => {setCaregiverEmail(emptyValue); concludeAction()}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.cancelLabelText]}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
      : <View style={{width: '100%'}}>
        <Spinner width={300} height={200}/>
      </View>}
    </ModalBox>
  )
}

export default function AddCaregiver({setRefresh, isSecond}: Readonly<{setRefresh: Function, isSecond: boolean}>) {

  const [modalVisible, setModalVisible] = useState(false)
  
  const buttonName = `${addCaregiverLabel} ` 

  const concludeAction = () => {
    setRefresh()
    setModalVisible(false)
  } 

  return (
   <>
    {!isSecond && <View style={{ borderBottomColor: 'white', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: '3%', borderWidth: 1 }}/>}
    <View style={[{flex: 0.5, margin: '3%', justifyContent: 'center', alignItems: 'center'}]}>
      <View style= { { flex: 0.35, flexDirection: 'row', justifyContent: 'space-around'} }>
        <AddCaregiverModal concludeAction={concludeAction} visibility={modalVisible}/>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCaregiver.button, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>{buttonName}</Text>
        </TouchableOpacity>
      </View>
    </View></>
  )
}