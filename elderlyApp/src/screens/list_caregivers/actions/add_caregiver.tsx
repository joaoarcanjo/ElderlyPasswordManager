import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types"
import React, { useState } from "react"
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native"
import { stylesButtons } from "../../../assets/styles/main_style"
import { stylesAddCaregiver } from "../styles/styles"
import { ModalBox } from "../../../components/Modal"
import { Spinner } from "../../../components/LoadingComponents"
import { modal, options } from "../../credential_interface/styles/styles"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"

function AddCaregiverModal({title, saveOptionFunction, cancelFunction, visibleFlag, loading}: Readonly<{title: string, saveOptionFunction: Function, cancelFunction: Function, visibleFlag: boolean, loading: boolean}>) {

  const [caregiverEmail, setCaregiverEmail] = useState('')

  return (
    <ModalBox visibleFlag={visibleFlag}>
      {loading ?
        <Spinner/>
        :  
        <>
          <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>{title}</Text>
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
            {(caregiverEmail != '') && <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginRight: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => saveOptionFunction(caregiverEmail)}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Vincular</Text>
            </TouchableOpacity> }
            <TouchableOpacity style={[{flex: 0.5, marginVertical: '3%', marginLeft: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => {setCaregiverEmail(''); cancelFunction()}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
    }
    </ModalBox>
  )
}

export default function AddCaregiver() {

    const navigation = useNavigation<StackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const addCaregiverFunction = (email: string) => {
      setLoading(true)
      console.log(email)
      startSession(email)
      const session = sessionForRemoteUser(email)
      currentSessionSubject.next(session ?? null)
      
      //TODO: Esperar a resposta do cuidador, se aceita ou não
      setLoading(false)
      setLoading(false)
    }
    
    return (
        <View style={[{flex: 0.5, margin: '3%', justifyContent: 'center', alignItems: 'center'}]}>
            <View style= { { flex: 0.35, flexDirection: 'row', justifyContent: 'space-around'} }>

                <AddCaregiverModal title={'Email do cuidador:'} saveOptionFunction={addCaregiverFunction} cancelFunction={() => setModalVisible(false)} visibleFlag={modalVisible} loading={loading}/>
                <TouchableOpacity style={[{flex: 1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCaregiver.button, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCaregiver.buttonText]}>VINCULAR CUIDADOR 2</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
  }