import React, { useState } from "react"
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native"
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

function AddCaregiverModal({number, visibility, concludeAction}: Readonly<{number: number, visibility: boolean, concludeAction: Function}>) {

  const [caregiverEmail, setCaregiverEmail] = useState('')
  const { userId, userEmail, userName, userPhone } = useSessionInfo()

  const addCaregiver = async (email: string) => {
    console.log("addCaregiverButtonPressed")
    saveCaregiver(userId, '', '', email, '', CaregiverRequestStatus.WAITING)
    .then(() =>  startSessionWithCaregiver(number, email, userId, userName, userEmail, userPhone))
    .then(() => sessionRequestSent())
    .then(() => concludeAction())
    .catch(async (error) => {
      const errorAux = error as ErrorInstance
      if(errorAux.code === Errors.ERROR_CAREGIVER_ALREADY_ADDED.valueOf()) alert(errorAux.code)
      else await deleteCaregiver(userId, email).then(() => alert(errorAux.code))
    })
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
          {(caregiverEmail != '') && <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginRight: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => addCaregiver(caregiverEmail)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Vincular</Text>
          </TouchableOpacity> }
          <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginLeft: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => {setCaregiverEmail(''); concludeAction()}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
    </ModalBox>
  )
}

export default function AddCaregiver({number, setRefresh}: Readonly<{number: number, setRefresh: Function}>) {

  const [modalVisible, setModalVisible] = useState(false)
  
  const buttonName = 'Adicionar cuidador ' + number

  const concludeAction = () => {
    setRefresh()
    setModalVisible(false)
  } 

  return (
    <View style={[{flex: 0.5, margin: '3%', justifyContent: 'center', alignItems: 'center'}]}>
      <View style= { { flex: 0.35, flexDirection: 'row', justifyContent: 'space-around'} }>
        <AddCaregiverModal number={number} concludeAction={concludeAction} visibility={modalVisible}/>
        <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCaregiver.button, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>{buttonName}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}