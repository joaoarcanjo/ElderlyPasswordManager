import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import {View, StyleSheet, Modal, TouchableOpacity, Text} from 'react-native'
import { stylesButtons } from "../assets/styles/main_style";
import { modal, options } from "../features/credential_interface/styles/styles";

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

export { YesOrNoModal, ModalBox }

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
  