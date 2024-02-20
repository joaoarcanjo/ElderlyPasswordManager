
import { Image } from 'react-native'
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { darkGreenBackgroud, lightBlueBackground, lightRedBackground, lightYellowBackground } from '../assets/styles/colors';

const enum FlashMessage {
  uriCopied = 'URI COPIADO!!',
  usernameCopied = 'UTILIZADOR COPIADO!!',
  passwordCopied = 'PASSWORD COPIADA!!',
  caregiverReject = 'O CUIDADOR REJEITOU A CONEXÃO!',
  caregiverAccept = 'O CUIDADOR ACEITOU A CONEXÃO!',
  editModeActive = 'MODO EDIÇÃO ATIVADO',
  editModeCanceled = 'MODO EDIÇÃO DESATIVADO',
  credentialUpdated = 'CREDENCIAL ATUALIZADA COM SUCESSO!',

}

function copyValue(value: string, message: FlashMessage) {
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

function editValueFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.editModeActive,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightBlueBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

function editCanceledFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.editModeCanceled,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightYellowBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

function editCompletedFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.credentialUpdated,
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: darkGreenBackgroud,
    duration: 3000,
    color: "black", // text color
  });
} 

function sessionAcceptedFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.caregiverAccept,
    icon: props => <Image source={require("../assets/images/check.png")} {...props} />,
    backgroundColor: darkGreenBackgroud,
    duration: 3000,
    color: "black", // text color
  });
}

function sessionRejectedFlash() {
  showMessage({
    floating: true,
    message: FlashMessage.caregiverReject,
    icon: props => <Image source={require("../assets/images/cross.png")} {...props} />,
    backgroundColor: lightRedBackground,
    duration: 3000,
    color: "black", // text color
  });
}

export { sessionRejectedFlash, sessionAcceptedFlash, copyValue, editValueFlash, editCompletedFlash, editCanceledFlash, FlashMessage }