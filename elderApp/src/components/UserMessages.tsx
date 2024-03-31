
import { Image, AppState } from 'react-native';
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { darkGreenBackgroud, lightBlueBackground, lightGreenBackgroud, lightRedBackground, lightYellowBackground, purpleBackground, superlightBlueBackgroud, superlightGreenBackground, yellowBackground } from '../assets/styles/colors';
import { triggerNotifications } from '../notifications/localNotifications';
import { CredentialBody } from '../e2e/messages/types';
import { durationQuickMessage, durationSlowMessage } from '../assets/constants';

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
  credentialUpdated = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
  sessionRequest = 'PEDIDO DE SESSÃO ENVIADO!',
  sessionRequestReceived = 'PEDIDO DE SESSÃO RECEBIDO!',
  sessionEnded = 'RELAÇÃO COM O CUIDADOR TERMINADA!',
  sessionAccepted = 'A CONEXÃO FOI ESTABELECIDA!',
  sessionRejected = 'A CONEXÃO NÃO FOI ESTABELECIDA!',
  caregiverPersonalInfoUpdated = 'O CUIDADOR ATUALIZOU OS SEUS DADOS PESSOAIS!'
}

//DESCRIPTIONS:
export const copyPasswordDescription = `A password foi guardada no clipboard.`
export const copyUsernameDescription = `O username foi guardado no clipboard.`
export const copyURIDescription = `O URI foi guardado no clipboard.`
export const cantAcceptConnection = `Não pode aceitar mais conexões.`

export function copyValue(value: string, message: FlashMessage, description: string = "") {
    Clipboard.setStringAsync(value)
    showMessage({
      floating: true,
      message: message,
      description: description,
      icon: props => <Image source={require("../assets/images/copy.png")} {...props} />,
      backgroundColor: superlightGreenBackground,
      duration: durationQuickMessage,
      color: "black", // text color
    });
}

export function editValueFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.editModeActive,
    description: '',
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: superlightBlueBackgroud,
    duration: durationQuickMessage,
    color: "black", // text color
  });
} 

export function editCanceledFlash(flashMessage: FlashMessage) {
  showMessage({
    floating: true,
    message: flashMessage,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightYellowBackground,
    duration: durationQuickMessage,
    color: "black", // text color
  });
} 

export function editCompletedFlash(flashMessage: FlashMessage) {
  //console.log('editCompletedFlash')
  showMessage({
    floating: true,
    message: flashMessage,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: darkGreenBackgroud,
    duration: durationQuickMessage,
    color: "black", // text color
  });
} 

export function sessionRequestSent() {
  //console.log('sessionRequestFlashSent')
  showMessage({
    floating: true,
    message: FlashMessage.sessionRequest,
    icon: props => <Image source={require("../assets/images/check.png")} {...props} />,
    backgroundColor: lightBlueBackground,
    duration: durationQuickMessage,
    color: "black", // text color
  });
} 

export function sessionRequestReceivedFlash(from: string) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.sessionRequestReceived,
      icon: props => <Image source={require("../assets/images/plus.png")} {...props} />,
      backgroundColor: purpleBackground,
      duration: durationQuickMessage,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Pedido de conexão recebido!! 🎉', `O idoso ${from} enviou um pedido de conexão.`, "")
  }
}

export function sessionAcceptedFlash(from: string, byMe: boolean) {
  //console.log('sessionAcceptedFlash')
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message:  byMe ? FlashMessage.sessionAccepted : FlashMessage.caregiverAccept,
      icon: props => <Image source={require("../assets/images/check.png")} {...props} />,
      backgroundColor: darkGreenBackgroud,
      duration: durationQuickMessage,
      color: "black", // text color
    });
  } else if(byMe) {
    triggerNotifications('Conexão aceite!! 🎉', `A sua conexão foi aceite.`, "")
  } else {
    triggerNotifications('Conexão aceite!! 🎉', `O cuidador ${from} aceitou a conexão.`, "")
  }
}

export function sessionRejectedFlash(from: string, byMe: boolean) {
  //console.log(AppState.currentState)
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message:  byMe ? FlashMessage.sessionRejected : FlashMessage.caregiverReject,
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: durationQuickMessage,
      color: "black", // text color
    });
  } else if(byMe) {
    triggerNotifications('Conexão rejeitada!! 😓', `A sua conexão foi rejeitada.`, "")
  } else {
    triggerNotifications('Conexão rejeitada!! 😓', `O cuidador ${from} rejeitou a conexão.`, "")
  }
}

export function sessionRejectMaxReachedFlash(from: string) {
  //console.log(AppState.currentState)
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: cantAcceptConnection,
      description: `O número máximo de conexões foi atingido, conexão com o cuidador ${from} rejeitada.`,
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: durationSlowMessage,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Conexão rejeitada!! 😓', `O cuidador ${from} foi rejeitado, número máximo atingido.`, "")
  }
}

export function sessionRejectedMaxReachedFlash(from: string) {
  //console.log(AppState.currentState)
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: cantAcceptConnection,
      description: `O cuidador ${from} não pode aceitar mais conexões, sendo assim rejeitada.`,
      icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: durationSlowMessage,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Conexão rejeitada!! 😓', `O cuidador ${from} não pode aceitar mais conexões.`, "")
  }
}

export function sessionEndedFlash(from: string, byMe: boolean) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: FlashMessage.sessionEnded,
      icon: props => <Image source={require("../assets/images/minus.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: durationQuickMessage,
      color: "black", // text color
    });
  } else {
    triggerNotifications('Relação terminada!!', `O cuidador ${from} terminou a conexão.`, "")
  }
}

export function credentialUpdatedByOtherFlash(from: string, info: CredentialBody) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: `O cuidador com o email ${from} atualizou uma credencial!`,
      description: `A informação da credencial ${info.platform} foi atualizada!`,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: superlightBlueBackgroud,
      duration: durationSlowMessage,
      color: "black", // text color
      position: 'top'
    });
  } else {
    triggerNotifications('CREDENTIAL ATUALIZADA!!', `O cuidador com o email ${from} alterou a credencial ${info.platform}.`, "")
  }
}

export function credentialCreatedByOtherFlash(from: string, info: CredentialBody) {
  if(AppState.currentState === 'active') {
    showMessage({
      floating: true,
      message: `O cuidador com o email ${from} criou uma credencial!`,
      description: `A credencial ${info.platform} foi criada.`,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: lightGreenBackgroud,
      duration: durationSlowMessage,
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
      message: `O cuidador com o email ${from} apagou uma credencial!`,
      description: `A informação da credencial ${info.platform} foi apagada!`,
      icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
      backgroundColor: lightRedBackground,
      duration: durationSlowMessage,
      color: "black", // text color
      position: 'top'
    });
  } else {
    triggerNotifications('CREDENCIAL APAGADA!!', `O cuidador com o email ${from} apagou a credencial ${info.platform}.`, "")
  }
}