
import { Image } from 'react-native'
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard'
import React from 'react';
import { lightBlueBackground, purpleBackground } from '../assets/styles/colors';

function copyValue(value: string) {
    Clipboard.setStringAsync(value)
    showMessage({
      message: 'COPIADO',
      type: 'success',
      icon: props => <Image source={require("../assets/images/copy.png")} {...props} />,
      color: "black", // text color
    });
}

function editValueFlash() {
  showMessage({
    message: 'MODO EDIÇÃO ATIVADO',
    type: 'success',
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: lightBlueBackground,
    color: "black", // text color
  });
} 

function editCompletedFlash() {
  showMessage({
    message: 'CREDENCIAL ATUALIZADA COM SUCESSO!',
    type: 'success',
    icon: props => <Image source={require("../assets/images/edit.png")} {...props} />,
    backgroundColor: purpleBackground,
    color: "black", // text color
  });
} 

export { copyValue, editValueFlash, editCompletedFlash }