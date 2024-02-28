import {StyleSheet} from 'react-native'
import { editButtonBackgroud, editButtonBorder, greyBackgroud, greyBorder, logoutButtonBackgroud, logoutButtonBorder, whiteBackgroud } from '../../../assets/styles/colors'

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

const accountInfo = StyleSheet.create({
    accountInfoContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 1, // Largura da linha na margem
      backgroundColor: greyBackgroud, // Cor de fundo
    },
    accountInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: whiteBackgroud, // Cor de fundo
    },
    editButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      borderWidth: 3, // Largura da linha na margem
      backgroundColor: editButtonBackgroud,
      borderColor: editButtonBorder,
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
    fontSize: 20,
    color: 'black'
  }
})

export { logout, accountInfo, appInfo }