import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types"
import React, { useEffect, useState } from "react"
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native"
import { stylesButtons } from "../../../assets/styles/main_style"
import { stylesAddCaregiver } from "../styles/styles"
import { ModalBox } from "../../../components/Modal"
import { Spinner } from "../../../components/LoadingComponents"
import { modal, options } from "../../credential_interface/styles/styles"
import { Observable } from "rxjs/internal/Observable"
import { currentSessionSubject } from "../../../e2e/session/state"
import { MessageList } from "../../add_caregiver/actions"
import { startSessionWithCaregiver } from "./functions"
import { ChatMessageType } from "../../../e2e/messages/types"
import { sessionAcceptedFlash, sessionRejectedFlash } from "../../../components/ShowFlashMessage"

function AddCaregiverModal({visibility, setVisibility}: Readonly<{visibility: boolean, setVisibility: Function}>) {

  const [caregiverEmail, setCaregiverEmail] = useState('')
  const currSession = useObservable(currentSessionSubject, null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(loading && currSession?.remoteUsername === caregiverEmail) {
      console.log(currSession?.messages.forEach((message) => {
        console.log("Message: ", message)
        if(message.type === ChatMessageType.ACCEPTED_SESSION) {
          
          //TODO: criar no sql a identidade do cuidador com o email, sendo os outros valores default
          //Os restantes valores serao preenchidos com a informação que o cuidador vai enviar à posteriori.

          //TODO: Enviar ao cuidador os seus dados. com o tipo PERSONAL_DATA.
          setVisibility(false)
          setLoading(false)
          sessionAcceptedFlash()
        }
        if(message.type === ChatMessageType.REJECT_SESSION) {
          
          setVisibility(false)
          setLoading(false)
          sessionRejectedFlash()
        }
      }))
    }
  }, [currentSessionSubject.value])

  const addCaregiver = async (email: string) => {
    setLoading(true)
    startSessionWithCaregiver(email) 
  }

  return (
    <ModalBox visibleFlag={visibility}>
      {loading ?
        <Spinner/>
        :  
        <>
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
          {currSession &&  <MessageList messages={currSession.messages} remoteUserName={currSession.remoteUsername} />}
          <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: '3%' }}/>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {(caregiverEmail != '') && <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginRight: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => addCaregiver(caregiverEmail)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Vincular</Text>
            </TouchableOpacity> }
            <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginLeft: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => {setCaregiverEmail(''); setVisibility(false)}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
    }
    </ModalBox>
  )
}

export default function AddCaregiver() {

    const [modalVisible, setModalVisible] = useState(false)
    
    return (
        <View style={[{flex: 0.5, margin: '3%', justifyContent: 'center', alignItems: 'center'}]}>
          <View style= { { flex: 0.35, flexDirection: 'row', justifyContent: 'space-around'} }>
             <AddCaregiverModal setVisibility={setModalVisible} visibility={modalVisible}/>
            <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCaregiver.button, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>VINCULAR CUIDADOR 2</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }

function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
      const subscription = observable.subscribe((newValue) => {
          setValue(newValue)
      })
      return () => subscription.unsubscribe()
  }, [observable])

  return value
}
