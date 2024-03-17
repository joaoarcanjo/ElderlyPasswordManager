
import { Image } from 'react-native'
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { darkGreenBackgroud, lightBlueBackground, lightRedBackground, lightYellowBackground } from '../assets/styles/colors';
import { AppState } from 'react-native';
import { triggerNotifications } from '../notifications/localNotifications';

export const enum FlashMessage {
  uriCopied = 'URI COPIADO!!',
  usernameCopied = 'UTILIZADOR COPIADO!!',
  passwordCopied = 'PASSWORD COPIADA!!',
  caregiverReject = 'O CUIDADOR REJEITOU A CONEXÃO!',
  caregiverAccept = 'O CUIDADOR ACEITOU A CONEXÃO!',
  editModeActive = 'MODO EDIÇÃO ATIVADO',
  editModeCanceled = 'MODO EDIÇÃO DESATIVADO',
  credentialUpdated = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
  sessionRequest = 'PEDIDO DE SESSÃO ENVIADO!',
}

export function copyValue(value: string, message: FlashMessage) {
    Clipboard.setStringAsync(value)
    showMessage({
      floating: true,
      message: message,
      icon: props => <Image source={require("../assets/images/copy.png")} {...props} />,
      backgroundColor: darkGreenBackgroud,
      duration: 3000,
      color: "black", // text color
    });
}

export function editValueFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.editModeActive,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightBlueBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

export function editCanceledFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.editModeCanceled,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightYellowBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

export function editCompletedFlash() {
  console.log('editCompletedFlash')
  showMessage({
    floating: true,
    message: FlashMessage.credentialUpdated,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: darkGreenBackgroud,
    duration: 3000,
    color: "black", // text color
  });
} 

export function sessionRequestSent() {
  console.log('sessionRequestFlashSent')
  showMessage({
    floating: true,
    message: FlashMessage.sessionRequest,
    icon: props => <Image source={require("../assets/images/check.png")} {...props} />,
    backgroundColor: lightBlueBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

export function sessionAcceptedFlash(from: string) {
  console.log(AppState.currentState)
  if(AppState.currentState !== 'background') {
    showMessage({
      floating: true,
      message: FlashMessage.sessionRequest,
      icon: props => <Image source={require("../assets/images/check.png")} {...props} />,
      backgroundColor: darkGreenBackgroud,
      duration: 3000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Conexão aceite!! 🎉', `O cuidador ${from} aceitou a conexão.`, "")
  }
}

export function sessionRejectedFlash(from: string) {
  console.log(AppState.currentState)
  if(AppState.currentState !== 'background') {
    showMessage({
      floating: true,
      message: FlashMessage.caregiverReject,
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: 3000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Conexão rejeitada!! 😓', `O cuidador ${from} rejeitou a conexão.`, "")
  }
}