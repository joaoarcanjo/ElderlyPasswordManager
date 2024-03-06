
import { Image, AppState } from 'react-native';
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { darkGreenBackgroud, lightBlueBackground, lightGreenBackgroud, lightRedBackground, lightYellowBackground, purpleBackground, yellowBackground } from '../assets/styles/colors';
import { triggerNotifications } from '../notifications/localNotifications';

export const enum FlashMessage {
  uriCopied = 'URI COPIADO!!',
  usernameCopied = 'UTILIZADOR COPIADO!!',
  passwordCopied = 'PASSWORD COPIADA!!',
  caregiverReject = 'O CUIDADOR REJEITOU A CONEXÃO!',
  caregiverAccept = 'O CUIDADOR ACEITOU A CONEXÃO!',
  editModeActive = 'MODO EDIÇÃO ATIVADO',
  editModeCanceled = 'MODO EDIÇÃO DESATIVADO',
  editCredentialCompleted = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
  editPersonalInfoCompleted = 'INFORMAÇÕES PESSOAIS ATUALIZADAS COM SUCESSO!',
  editCredentialCanceled = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
  editPersonalInfoCanceled = 'INFORMAÇÕES PESSOAIS ATUALIZADAS COM SUCESSO!',
  credentialUpdated = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
  sessionRequest = 'PEDIDO DE SESSÃO ENVIADO!',
  sessionRequestReceived = 'PEDIDO DE SESSÃO RECEBIDO!',
  sessionEnded = 'RELAÇÃO COM O IDOSO TERMINADA!',
  sessionPermissions = 'O IDOSO ATUALIZOU AS PERMISSÕES!',
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

export function editCanceledFlash(flashMessage: FlashMessage) {
  showMessage({
    floating: true,
    message: flashMessage,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightYellowBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

export function editCompletedFlash(flashMessage: FlashMessage) {
  console.log('editCompletedFlash')
  showMessage({
    floating: true,
    message: flashMessage,
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
  console.log('sessionAcceptedFlash')
  console.log(AppState.currentState)
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.caregiverAccept,
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
  if(AppState.currentState === 'active') {
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

export function sessionRequestReceivedFlash(from: string) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.sessionRequestReceived,
      icon: props => <Image source={require("../assets/images/plus.png")} {...props} />,
      backgroundColor: purpleBackground,
      duration: 3000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Pedido de conexão recebido!! 🎉', `O idoso ${from} enviou um pedido de conexão.`, "")
  }
}

export function sessionEndedFlash(from: string) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.sessionEnded,
      icon: props => <Image source={require("../assets/images/minus.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: 3000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Relação terminada!!', `O idoso ${from} terminou a conexão.`, "")
  }
}

export function sessionPermissionsFlash(from: string) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.sessionPermissions,
      icon: props => <Image source={require("../assets/images/minus.png")} {...props} />,
      backgroundColor: yellowBackground,
      duration: 3000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Permissões atualizadas!!', `O idoso ${from} atualizou as permissões.`, "")
  }
}