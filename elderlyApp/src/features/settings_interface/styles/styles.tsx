import {StyleSheet} from 'react-native'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const logout = StyleSheet.create({
    logoutButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: '#e35f5f',
        borderColor: '#a31f1f',
    },
    logoutButtonText: {
      fontSize: 25,
      color: '#f5f5f5'
    }
})

const accountInfo = StyleSheet.create({
    accountInfoContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: '#DCE0DE', // Cor de fundo
    },
    accountInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: 'white', // Cor de fundo
    },
    editButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      borderWidth: 3, // Largura da linha na margem
      backgroundColor: '#F3E7AB',
      borderColor: '#E1C748',
    },
    accountInfoText: {
      fontSize: 20,
      color: 'black'
    }
})

const appInfo = StyleSheet.create({
  appInfoContainer: {
    borderRadius: 20, // Define o raio dos cantos para arredondá-los
    borderWidth: 2, // Largura da linha na margem
    backgroundColor: '#DCE0DE', // Cor de fundo
  },
  appInfo: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      borderWidth: 3, // Largura da linha na margem
      backgroundColor: 'white', // Cor de fundo
  },
  appInfoText: {
    fontSize: 20,
    color: 'black'
  }
})

export { logout, accountInfo, appInfo }