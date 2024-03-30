import { BlurView } from "expo-blur";
import React, { ReactNode, useState } from "react";
import {View, StyleSheet, Modal, TouchableOpacity, Text} from 'react-native'
import { stylesButtons } from "../assets/styles/main_style"
import { modal, options } from "../screens/credential_interface/styles/styles"
import { Spinner } from "./LoadingComponents"
import { upperLabel, lowerLabel, numbersLabel, specialLabel } from "../assets/constants";
import { RequirementLength, Requirement } from "./passwordGenerator/Requirement";
import { updateUpperCase, updateLowerCase, updateNumbers, updateSpecial } from "./passwordGenerator/functions";

function YesOrNoModal({question, yesFunction, noFunction, visibleFlag}: Readonly<{question: string, yesFunction: Function, noFunction: Function, visibleFlag: boolean}>) {
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>{question}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => yesFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => noFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Não</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  )
}

function YesOrNoSpinnerModal({question, yesFunction, noFunction, visibleFlag, loading}: Readonly<{question: string, yesFunction: Function, noFunction: Function, visibleFlag: boolean, loading: boolean}>) {

  return (
    <ModalBox visibleFlag={visibleFlag}>
      {loading ?
        <Spinner width={300} height={300} />
        :  
        <>
          <Text numberOfLines={2} adjustsFontSizeToFit style={modal.modalText}>{question}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.saveButton]} onPress={() => yesFunction()}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => noFunction()}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Não</Text>
            </TouchableOpacity>
          </View>
        </>
    }
    </ModalBox>
  )
}

export function PasswordOptionsModal({saveFunction, closeFunction, visibleFlag}: Readonly<{saveFunction: Function, closeFunction: Function, visibleFlag: boolean, loading: boolean}>) {

  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [special, setSpecial] = useState(true)
  const [length, setLength] = useState(15)

  const saveRequirements = () => {
    saveFunction({length: length, strict: true, symbols: special, uppercase: uppercase, lowercase: lowercase, numbers: numbers})
    closeFunction()
  }
  
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <View>
        <RequirementLength setLength={setLength} currentLength={length}/>
        <View style={{flexDirection: 'row', marginTop: '5%'}}>
          <Requirement name={upperLabel} value={uppercase} func={() => {updateUpperCase(setUppercase, uppercase, lowercase, numbers, special)}}/>
          <Requirement name={lowerLabel} value={lowercase} func={() => {updateLowerCase(setLowercase, uppercase, lowercase, numbers, special)}}/>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Requirement name={numbersLabel} value={numbers} func={() => {updateNumbers(setNumbers, uppercase, lowercase, numbers, special)}}/>
          <Requirement name={specialLabel} value={special} func={() => {updateSpecial(setSpecial, uppercase, lowercase, numbers, special)}}/>
        </View>
        <View style={{ borderBottomColor: 'black', borderWidth: StyleSheet.hairlineWidth, marginVertical: '5%' }}/>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.greenButton]} onPress={saveRequirements}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, options.cancelButton]} onPress={() => closeFunction()}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.permissionsButtonText]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalBox>
  )
}

function ModalBox({children, visibleFlag}: Readonly<{children: ReactNode, visibleFlag: boolean}>) {
    return (
        <Modal
      transparent
      animationType="slide"
      visible={visibleFlag}
      >
        <BlurView
          style={{ flex: 1 }}
          intensity={60} // You can adjust the intensity of the blur
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {children}
            </View>
          </View>
        </BlurView>
      </Modal>
    )
}

export { YesOrNoSpinnerModal, YesOrNoModal, ModalBox }

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
  