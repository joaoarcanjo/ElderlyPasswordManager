
import { Image } from 'react-native'
import { showMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard'
import React from 'react';

export default function copyValue(value: string) {
    Clipboard.setStringAsync(value)
    showMessage({
      message: 'COPIADO',
      type: 'success',
      icon: props => <Image source={require("../assets/images/copy.png")} {...props} />,
      color: "black", // text color
    });
}