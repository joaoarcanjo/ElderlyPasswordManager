import {StyleSheet} from 'react-native'
import { editCredentialsButtonBackground, editCredentialsButtonBorder, greyBackgroud, greyBorder, logoutButtonBackgroud, logoutButtonBorder, permissionsButtonBackground, permissionsButtonBorder, whiteBackgroud } from '../../../assets/styles/colors'

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
    borderRadius: 20, // Define o raio dos cantos para arredondá-los
    borderWidth: 2, // Largura da linha na margem
    backgroundColor: greyBackgroud, // Cor de fundo
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

export { changer, logout, credentials, options }