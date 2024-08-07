import {StyleSheet} from 'react-native'
import { borderColorDark, cancelTextColor, copyTextColor, credentialEditBackground, credentialEditBorder, deleteCredentialButtonBackground, deleteCredentialButtonBorder, doubtOptionTextColor, editTextColor, generateTextColor, color7, greyBorder, loginCardButtonTextColor, logoutButtonBackgroud, logoutButtonBorder, navigateTextColor, noButtonTextColor, optionsTextColor, regenerateButtonBackgroud, regenerateButtonBorder, requirementTextColor, saveAcceptTextColor, vinculateButtonTextColor, color8, darkGrey } from '../../../assets/styles/colors'
import { bigTextSize, buttonBigTextSize, buttonHyperSmallTextSize, buttonNormalTextSize, buttonSmallTextSize, modalTextSize } from '../../../assets/styles/text'

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

const credentials = StyleSheet.create({
  credentialInfoContainer: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    borderWidth: 2, // Largura da linha na margem
    backgroundColor: color7, // Cor de fundo
    borderColor: borderColorDark
  },
  credentialInputContainer: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    borderWidth: 1, // Largura da linha na margem
    backgroundColor: color8, // Cor de fundo
  },
  credentialInputContainerV2: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    borderWidth: 2, // Largura da linha na margem
    backgroundColor: credentialEditBackground, // Cor de fundo
    borderColor: credentialEditBorder
  },
  credentialInfoButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: color8, // Cor de fundo
      borderColor: greyBorder
  },
  regenerateButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      borderWidth: 5, // Largura da linha na margem
      backgroundColor: regenerateButtonBackgroud,
      borderColor: regenerateButtonBorder,
  },
  deleteCredentialButton: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    borderWidth: 5, // Largura da linha na margem
    backgroundColor: deleteCredentialButtonBackground,
    borderColor: deleteCredentialButtonBorder,
  },
  credentialInfoText: {
    fontSize: buttonSmallTextSize,
    color: darkGrey
  }
})

const changer = StyleSheet.create({
  caregiverNameContainer: {
    borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
    borderTopRightRadius: 20, // Arredonda o canto inferior direito
    borderBottomWidth: 0,
    borderWidth: 2, // Largura do contorno
    borderColor: greyBorder, // Cor do contorno
    backgroundColor: color8
  } 
})

const options = StyleSheet.create({
  loginCardLabelText: {
    fontSize: buttonBigTextSize,
    fontWeight: 'bold',
    color: loginCardButtonTextColor
  },
  requirementLabelText: {
    fontSize: bigTextSize,
  },
  linkLabelText: {
    fontSize: buttonBigTextSize,
    color: vinculateButtonTextColor,
    fontWeight: 'bold'
  },
  noLabelText: {
    fontSize: buttonBigTextSize,
    color: noButtonTextColor,
    fontWeight: 'bold'
  },
  yesLabelText: {
    fontSize: buttonBigTextSize,
    color: noButtonTextColor,
    fontWeight: 'bold'
  },
  cancelLabelText: {
    fontSize: buttonBigTextSize,
    color: cancelTextColor,
    fontWeight: 'bold'
  },
  saveAcceptLabelText: {
    fontSize: buttonBigTextSize,
    color: saveAcceptTextColor,
    fontWeight: 'bold'
  },
  optionsLabelText: {
    fontSize: buttonBigTextSize,
    color: optionsTextColor,
    fontWeight: 'bold'
  },
  generateLabelText: {
    fontSize: buttonBigTextSize,
    color: generateTextColor,
    fontWeight: 'bold'
  },
  editButtonText: {
    fontSize: buttonBigTextSize,
    color: editTextColor,
    fontWeight: 'bold'
  },
  copyButtonText: {
    fontSize: buttonHyperSmallTextSize,
    color: copyTextColor,
    fontWeight: 'bold'
  },
  navigateButtonText: {
    fontSize: buttonHyperSmallTextSize,
    color: navigateTextColor,
    fontWeight: 'bold'
  },
  doubtOptionButtonText: {
    fontSize: buttonHyperSmallTextSize,
    color: doubtOptionTextColor,
    fontWeight: 'bold'
  }
})

const modal = StyleSheet.create({
  modalText: {
    fontSize: modalTextSize,
    marginBottom: 15,
    textAlign: 'center',
    color: darkGrey
  },
})

export { changer, logout, credentials, options, modal }