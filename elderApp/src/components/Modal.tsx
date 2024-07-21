import { BlurView } from "expo-blur";
import React, { ReactNode, useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Text, ScrollView } from 'react-native'
import { stylesButtons } from "../assets/styles/main_style"
import { modal, options } from "../screens/credential_interface/styles/styles"
import { Spinner } from "./LoadingComponents"
import { upperLabel, lowerLabel, numbersLabel, specialLabel, passwordDefaultLengthGenerator, modalIntensity, saveLabel, loginLabel, cardLabel, cancelLabel, yesOption, noOption, requirementLabel } from "../assets/constants/constants";
import { updateUpperCase, updateLowerCase, updateNumbers, updateSpecial } from "./passwordGenerator/functions";
import { Requirement, RequirementLength } from "./passwordGenerator/Requirement";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color8, platformButtonBackgroud, platformButtonBorder } from "../assets/styles/colors";
import { platformsModalSize } from "../assets/styles/text";

export function YesOrNoModal({question, yesFunction, noFunction, visibleFlag, isLoading}: Readonly<{question: string, yesFunction: Function, noFunction: Function, visibleFlag: boolean, isLoading?: boolean}>) {
  return (
    <ModalBox visibleFlag={visibleFlag}>
      {!isLoading ?
      <View>
        <Text numberOfLines={3} adjustsFontSizeToFit style={modal.modalText}>{question}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={() => yesFunction()}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[options.yesLabelText]}>{yesOption}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.rejectButton]} onPress={() => noFunction()}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.noLabelText]}>{noOption}</Text>
          </TouchableOpacity>
        </View>
      </View>
    :
    <Spinner width={300} height={200}></Spinner>}
    </ModalBox>
  )
}

export function CredentialTypeModal({question, loginFunction, cardFunction, visibleFlag}: Readonly<{question: string, loginFunction: Function, cardFunction: Function, visibleFlag: boolean}>) {
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <Text numberOfLines={3} adjustsFontSizeToFit style={modal.modalText}>{question}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.loginButton]} onPress={() => loginFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.loginCardLabelText]}>{loginLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.cardButton]} onPress={() => cardFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.loginCardLabelText]}>{cardLabel}</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  )
}

export function YesOrNoSpinnerModal({question, yesFunction, noFunction, visibleFlag, loading}: Readonly<{question: string, yesFunction: Function, noFunction: Function, visibleFlag: boolean, loading: boolean}>) {

  return (
    <ModalBox visibleFlag={visibleFlag}>
      {loading ?
        <Spinner width={300} height={300}/>
        :  
        <>
          <Text numberOfLines={3} adjustsFontSizeToFit style={modal.modalText}>{question}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={() => yesFunction()}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.yesLabelText]}>{yesOption}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={() => noFunction()}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.noLabelText]}>{noOption}</Text>
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
  const [length, setLength] = useState(passwordDefaultLengthGenerator)

  const saveRequirements = () => {
    saveFunction({length: length, strict: true, symbols: special, uppercase: uppercase, lowercase: lowercase, numbers: numbers})
    closeFunction()
  }
  
  return (
    <ModalBox visibleFlag={visibleFlag}>
      <View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={modal.modalText}>{requirementLabel}</Text>
      <View style={{ borderBottomColor: 'black', borderWidth: StyleSheet.hairlineWidth, marginBottom: '5%' }}/>
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
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.acceptButton]} onPress={saveRequirements}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.saveAcceptLabelText]}>{saveLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={() => closeFunction()}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '10%'}, options.cancelLabelText]}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalBox>
  )
}

export function PlatformSelectionModal({setPlatformName, setPlatformURI, closeFunction, visibleFlag}: Readonly<{setPlatformName: Function, setPlatformURI: Function, closeFunction: Function, visibleFlag: boolean}>) {

  interface Platform { platformName: any, platformURI: any, materialCommunityIcon: any, iconColor: any }

  const jsonData = require('../assets/json/platforms.json');

  const applySelection = (platform: Platform) => {
    setPlatformName(platform.platformName)
    setPlatformURI(platform.platformURI)
    closeFunction()
  }

  return (
    <ModalBox visibleFlag={visibleFlag}>
      <View style={{flexDirection: 'row', maxHeight: '85%'}}>
        <ScrollView style={{width: '100%'}}>
          {jsonData.platforms.map((platform: Platform, index: string) => 
            <View key={index} style={{flexDirection: 'row'}}>
              <TouchableOpacity style={[{flex: 1, marginVertical: '3%', flexDirection: 'row'}, stylesButtons.mainConfig, platformSelection.itemButton]} onPress={() => {applySelection(platform)}}>
                <MaterialCommunityIcons name={platform.materialCommunityIcon} size={35} color={platform.iconColor}/>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: platformsModalSize, margin: '3%', color: platform.iconColor, fontWeight: 'bold' }]}>{platform.platformName}</Text>
              </TouchableOpacity>
            </View>  
          )}
        </ScrollView>
      </View><View style={{ height: 1, backgroundColor: 'black', marginVertical: '3%' }}/>
      <View style={{flexDirection: 'row', marginBottom: '2%'}}>
        <TouchableOpacity style={[{flex: 1, margin: '3%'}, stylesButtons.mainConfig, stylesButtons.cancelButton]} onPress={() => closeFunction()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '3%' }, options.cancelLabelText]}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </ModalBox>
  )
}

export function ModalBox({children, visibleFlag}: Readonly<{children: ReactNode, visibleFlag: boolean}>) {
    return (
        <Modal
      transparent
      animationType="slide"
      visible={visibleFlag}
      >
        <BlurView
          style={{ flex: 1 }}
          intensity={modalIntensity}
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    maxHeight: '60%', // 90% of the screen height
    margin: '8%',
    backgroundColor: color8,
    borderRadius: 20,
    padding: '8%',
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

const platformSelection = StyleSheet.create({
  itemButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: platformButtonBackgroud, // Cor de fundo
      borderColor: platformButtonBorder,
  }
})