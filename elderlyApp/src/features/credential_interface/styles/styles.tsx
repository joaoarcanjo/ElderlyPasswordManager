import {StyleSheet} from 'react-native'
import { blueBorder, cancelButtonBackground, cancelButtonBorder, editCredentialsButtonBackground, editCredentialsButtonBorder, greyBackgroud, greyBorder, hiperlightBlueBackground, lightBlueBackground, lightYellowBackground, logoutButtonBackgroud, logoutButtonBorder, permissionsButtonBackground, permissionsButtonBorder, saveButtonBackground, saveButtonBorder, superlightBlueBackgroud, whiteBackgroud } from '../../../assets/styles/colors'

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
      color: '#f5f5f5'
    }
})

const credentials = StyleSheet.create({
  credentialInfoContainer: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    borderWidth: 2, // Largura da linha na margem
    backgroundColor: greyBackgroud, // Cor de fundo
  },
  credentialInputContainer: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    borderWidth: 2, // Largura da linha na margem
    backgroundColor: whiteBackgroud, // Cor de fundo
  },
  credentialInputContainerV2: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    borderWidth: 3, // Largura da linha na margem
    backgroundColor: lightYellowBackground, // Cor de fundo
    borderColor: blueBorder
  },
  credentialInfoButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: whiteBackgroud, // Cor de fundo
      borderColor: greyBorder
  },
  credentialInfoText: {
    fontSize: 20,
    color: 'black'
  }
})

const changer = StyleSheet.create({
  caregiverNameContainer: {
    borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
    borderTopRightRadius: 20, // Arredonda o canto inferior direito
    borderBottomWidth: 0,
    borderWidth: 2, // Largura do contorno
    borderColor: greyBorder, // Cor do contorno
    backgroundColor: whiteBackgroud
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
  permissionButton: {
    borderRadius: 15, // Define o raio dos cantos para arredondá-los
    backgroundColor: permissionsButtonBackground,
    borderColor: permissionsButtonBorder
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

const modal = StyleSheet.create({
  modalText: {
    fontSize: 25,
    marginBottom: 15,
    textAlign: 'center',
  },
})

export { changer, logout, credentials, options, modal }