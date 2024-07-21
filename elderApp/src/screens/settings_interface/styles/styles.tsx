import {StyleSheet} from 'react-native'
import { accountInfoContainerBackgroud, accountInputContainerBackgroud, accountInputContainerBackgroudV2, accountInputContainerBorderV2, borderColorDark, logoutButtonBackgroud, logoutButtonBorder, color8, darkGrey } from '../../../assets/styles/colors'
import { buttonNormalTextSize, settingsAccountInfoTextSize, settingsEmailInfoTextSize } from '../../../assets/styles/text'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const logout = StyleSheet.create({
    logoutButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: logoutButtonBackgroud,
        borderColor: logoutButtonBorder,
    },
    logoutButtonText: {
      fontSize: buttonNormalTextSize,
      color: color8,
    fontWeight: 'bold'
    }
})

const accountInfo = StyleSheet.create({
    accountInfoContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: accountInfoContainerBackgroud, // Cor de fundo
      borderColor: borderColorDark
    },
    accountInputContainer: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      borderWidth: 1, // Largura da linha na margem
      backgroundColor: accountInputContainerBackgroud, // Cor de fundo
    },
    accountInputContainerV2: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: accountInputContainerBackgroudV2, // Cor de fundo
      borderColor: accountInputContainerBorderV2
    },
    emailInfoText: {
      fontWeight: 'bold',
      fontSize: settingsEmailInfoTextSize,
      color: darkGrey
    },
    accountInfoText: {
      fontSize: settingsAccountInfoTextSize,
      color: darkGrey
    }
})


export { logout, accountInfo }