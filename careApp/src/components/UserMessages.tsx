
import { Image, AppState } from 'react-native';
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { darkGreenBackgroud, lightBlueBackground, lightGreenBackgroud, lightRedBackground, lightYellowBackground, purpleBackground, superlightBlueBackgroud, superlightGreenBackground, yellowBackground } from '../assets/styles/colors';
import { triggerNotifications } from '../notifications/localNotifications';
import { CredentialBody } from '../e2e/messages/types';

export const enum FlashMessage {
  uriCopied = 'URI COPIADO!!',
  usernameCopied = 'UTILIZADOR COPIADO!!',
  passwordCopied = 'PASSWORD COPIADA!!',
  elderlyReject = 'O IDOSO REJEITOU A CONEXÃO!',
  elderlyAccept = 'O IDOSO ACEITOU A CONEXÃO!',
  editModeActive = 'MODO EDIÇÃO ATIVADO',
  editModeCanceled = 'MODO EDIÇÃO DESATIVADO',
  editCredentialCompleted = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
  editPersonalInfoCompleted = 'INFORMAÇÕES PESSOAIS ATUALIZADAS COM SUCESSO!',
  sessionRequest = 'PEDIDO DE SESSÃO ENVIADO!',
  sessionRequestReceived = 'PEDIDO DE SESSÃO RECEBIDO!',
  sessionEnded = 'RELAÇÃO COM O IDOSO TERMINADA!',
  sessionAccepted = 'A CONEXÃO FOI ESTABELECIDA!',
  sessionRejected = 'A CONEXÃO NÃO FOI ESTABELECIDA!',
  sessionPermissions = 'O IDOSO ATUALIZOU AS PERMISSÕES!',
  elderlyPersonalInfoUpdated = 'O IDOSO ATUALIZOU OS SEUS DADOS PESSOAIS!',
}

//DESCRIPTIONS:
export const copyPasswordDescription = `A password foi guardada no clipboard.`
export const copyUsernameDescription = `O username foi guardado no clipboard.`
export const copyURIDescription = `O URI foi guardado no clipboard.`

export function copyValue(value: string, message: FlashMessage, description: string = "") {
    Clipboard.setStringAsync(value)
    showMessage({
      floating: true,
      message: message,
      description: description,
      icon: props => <Image source={require("../assets/images/copy.png")} {...props} />,
      backgroundColor: superlightGreenBackground,
      duration: 6000,
      color: "black", // text color
    });
}

export function editValueFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.editModeActive,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightBlueBackground,
    duration: 6000,
    color: "black", // text color
  });
} 

export function editCanceledFlash(flashMessage: FlashMessage) {
  showMessage({
    floating: true,
    message: flashMessage,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightYellowBackground,
    duration: 6000,
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
    duration: 6000,
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
    duration: 6000,
    color: "black", // text color
  });
} 

export function sessionAcceptedFlash(from: string) {
  console.log('sessionAcceptedFlash')
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.elderlyAccept,
      icon: props => <Image source={require("../assets/images/check.png")} {...props} />,
      backgroundColor: darkGreenBackgroud,
      duration: 6000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Conexão aceite!! 🎉', `O idoso ${from} aceitou a conexão.`, "")
  }
}

export function sessionRejectedFlash(from: string, byMe: boolean) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message:  byMe ? FlashMessage.sessionRejected : FlashMessage.elderlyReject,
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: 3000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Conexão rejeitada!! 😓', `O idoso ${from} rejeitou a conexão.`, "")
  }
}

export function sessionRequestReceivedFlash(from: string) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.sessionRequestReceived,
      icon: props => <Image source={require("../assets/images/plus.png")} {...props} />,
      backgroundColor: purpleBackground,
      duration: 6000,
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
      duration: 6000,
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
      duration: 6000,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Permissões atualizadas!!', `O idoso ${from} atualizou as permissões.`, "")
  }
}

export function credentialUpdatedByOtherFlash(from: string, info: CredentialBody) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: `O idoso com o email ${from} atualizou uma credencial!`,
      description: `A informação da credencial ${info.platform} foi atualizada.`,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: superlightBlueBackgroud,
      duration: 7000,
      color: "black", // text color
      position: 'top'
    });
  } else {
    triggerNotifications('CREDENTIAL ATUALIZADA!!', `O idoso com o email ${from} alterou a credencial ${info.platform}.`, "")
  }
}

export function credentialCreatedByOtherFlash(from: string, info: CredentialBody) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: `O idoso com o email ${from} criou uma credencial!`,
      description: `A credencial ${info.platform} foi criada.`,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: lightGreenBackgroud,
      duration: 7000,
      color: "black", // text color
      position: 'top'
    });
  } else {
    triggerNotifications('CREDENCIAL ATUALIZADA!!', `O cuidador com o email ${from} alterou a credencial ${info.platform}.`, "")
  }
}

export function credentialDeletedByOtherFlash(from: string, info: CredentialBody) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: `O idoso com o email ${from} apagou uma credencial!`,
      description: `A informação da credencial ${info.platform} foi apagada!`,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: 7000,
      color: "black", // text color
      position: 'top'
    });
  } else {
    triggerNotifications('CREDENCIAL APAGADA!!', `O idoso com o email ${from} apagou a credencial ${info.platform}.`, "")
  }
}