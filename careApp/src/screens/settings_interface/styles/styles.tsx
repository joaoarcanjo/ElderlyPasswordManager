import {StyleSheet} from 'react-native'
import { accountInfoContainerBackgroud, accountInputContainerBackgroud, accountInputContainerBackgroudV2, accountInputContainerBorderV2, cancelButtonBackground, cancelButtonBorder, editCredentialsButtonBackground, editCredentialsButtonBorder, greyBackgroud, greyBorder, logoutButtonBackgroud, logoutButtonBorder, saveButtonBackground, saveButtonBorder, whiteBackgroud } from '../../../assets/styles/colors'

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
      fontSize: 25,
      color: whiteBackgroud
    }
})

const accountInfo = StyleSheet.create({
    accountInfoContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 1, // Largura da linha na margem
      backgroundColor: accountInfoContainerBackgroud, // Cor de fundo
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
      fontSize: 25,
      color: 'black'
    },
    accountInfoText: {
      fontSize: 20,
      color: 'black'
    }
})

const appInfo = StyleSheet.create({
  appInfoContainer: {
    borderRadius: 20, // Define o raio dos cantos para arredondá-los
    borderWidth: 1, // Largura da linha na margem
    backgroundColor: greyBackgroud, // Cor de fundo
  },
  appInfoButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: whiteBackgroud, // Cor de fundo
      borderColor: greyBorder
  },
  appInfoText: {
    fontSize: 19,
    color: 'black'
  }
})


const options = StyleSheet.create({
  editButton: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    backgroundColor: editCredentialsButtonBackground,
    borderColor: editCredentialsButtonBorder
  },
  saveButton: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    backgroundColor: saveButtonBackground,
    borderColor: saveButtonBorder
  },
  cancelButton: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    backgroundColor: cancelButtonBackground,
    borderColor: cancelButtonBorder
  },
  permissionsButtonText: {
    fontSize: 25,
    color: 'black'
  },
  editButtonText: {
    fontSize: 25,
    color: 'black'
  }
})

export { logout, accountInfo, appInfo }