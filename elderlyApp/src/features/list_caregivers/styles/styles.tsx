import {StyleSheet} from 'react-native'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCaregiver = StyleSheet.create({
    addCaregiverButton: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        backgroundColor: '#58b859',
        borderColor: '#449447',
        borderWidth: 3, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    addCaregiverButtonText: {
        fontSize: 25,
        color: '#f5f5f5'
    }
})

/**
 * Estilos da scroll view com as credenciais
 */
const styleScroolView = StyleSheet.create({
    caregiversContainer: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderWidth: 2, // Largura da linha na margem
    },
    itemContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: '#DCE0DE', // Cor de fundo
        borderColor: '#8c8d8f',
        marginVertical: 8, // Margem vertical entre os itens
    },
    button: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: 'white',
        borderColor: '#9c9c9c',
        borderWidth: 3, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
})

const caregiverContactInfo = StyleSheet.create({
    contactContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: '#DCE0DE', // Cor de fundo
    },
    accountInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: 'white', // Cor de fundo
    },
    callButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: 'white',
      borderColor: '#9c9c9c',
      borderWidth: 3, // Largura da linha na margem
      elevation: 3, // Android
      shadowColor: 'rgba(0,0,0, .3)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
    },
    sendEmailButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: 'white',
        borderColor: '#9c9c9c',
        borderWidth: 3, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    accountInfoText: {
      fontSize: 20,
      color: 'black'
    }
})

const decouplingOption = StyleSheet.create({
    yesButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: '#58b859',
      borderColor: '#449447',
      borderWidth: 3, // Largura da linha na margem
      elevation: 3, // Android
      shadowColor: 'rgba(0,0,0, .3)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
    },
    noButton: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: '#e35f5f',
      borderColor: '#a31f1f',
      borderWidth: 3, // Largura da linha na margem
      elevation: 3, // Android
      shadowColor: 'rgba(0,0,0, .3)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
    },
    optionText: {
        color: '#f5f5f5'
    },
    decouplingMessage: {
      fontSize: 20,
      color: 'black'
    }
})


export { stylesAddCaregiver, styleScroolView, caregiverContactInfo, decouplingOption }