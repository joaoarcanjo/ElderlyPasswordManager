
import { Image } from 'react-native'
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard'
import React from 'react';
import { darkGreenBackgroud, lightBlueBackground, lightYellowBackground } from '../assets/styles/colors';

const enum FlashMessage {
  usernameCopied = 'UTILIZADOR COPIADO!!',
  passwordCopied = 'PASSWORD COPIADA!!',
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
    message: 'MODO EDIÇÃO ATIVADO',
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightBlueBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

function editCanceledFlash() {
  showMessage({
    floating: true,
    message: 'MODO EDIÇÃO DESATIVADO',
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightYellowBackground,
    duration: 3000,
    color: "black", // text color
  });
} 

function editCompletedFlash() {
  showMessage({
    floating: true,
    message: 'CREDENCIAL ATUALIZADA COM SUCESSO!',
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: darkGreenBackgroud,
    duration: 3000,
    color: "black", // text color
  });
} 

export { copyValue, editValueFlash, editCompletedFlash, editCanceledFlash, FlashMessage }