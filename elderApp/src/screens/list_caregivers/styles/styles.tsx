import {StyleSheet} from 'react-native'
import { acceptButtonBackground, acceptButtonBorder, addCaregiverButtonBackgroud, addCaregiverButtonBorder, blueBorder, desvinculateButtonBackgroud, desvinculateButtonBorder, greyBackgroud, greyBorder, permissionsNoButtonBackground, permissionsNoButtonBorder, permissionsYesButtonBackground, permissionsYesButtonBorder, rejectButtonBackground, rejectButtonBorder, superlightBlueBackgroud, whiteBackgroud } from '../../../assets/styles/colors'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCaregiver = StyleSheet.create({
    button: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        backgroundColor: addCaregiverButtonBackgroud,
        borderColor: addCaregiverButtonBorder,
        borderWidth: 3, // Largura da linha na marge
    },
    buttonText: {
        fontSize: 25,
        color: '#f5f5f5',
        fontWeight: 'bold'
    }
})

const caregiverStyle = StyleSheet.create({
    container: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginVertical: 8, // Margem vertical entre os itens
    },
    newCaregiverContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: superlightBlueBackgroud, // Cor de fundo
        borderColor: blueBorder,
        marginBottom: 15,
    },
    newCaregiverText: {
        fontSize: 20,
        color: 'black'
    },
    sentRequestCaregiverContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginBottom: 15,
    }
})

const caregiverContactInfo = StyleSheet.create({
    contactContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: greyBackgroud, // Cor de fundo
      borderColor: greyBorder
    },
    accountInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: whiteBackgroud, // Cor de fundo
        borderColor: greyBorder
    },
    accountInfoText: {
      fontSize: 20,
      color: 'black'
    }
})

const decouplingOption = StyleSheet.create({
    button: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: desvinculateButtonBackgroud,
      borderColor: desvinculateButtonBorder,
      borderWidth: 3
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 22, 
        color: '#f5f5f5'
    }
})

const caregiver = StyleSheet.create({
    container: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginVertical: 8, // Margem vertical entre os itens
    }
})

const permission = StyleSheet.create({
    questionText: {
        fontSize: 20,
        color: 'black'
    },
    yesButton: {
        borderRadius: 9, // Define o raio dos cantos para arredondá-los
        backgroundColor: permissionsYesButtonBackground,
        borderColor: permissionsYesButtonBorder
    },
    noButton: {
        borderRadius: 9, // Define o raio dos cantos para arredondá-los
        backgroundColor: permissionsNoButtonBackground,
        borderColor: permissionsNoButtonBorder
    },
    yesButtonText: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white'
    },
    nButtonText: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white'
    },
})

const newCaregiverContainer = StyleSheet.create({
    buttonText: {
      fontSize: 25,
      color: 'black'
    },
})

export { newCaregiverContainer, caregiver, permission, stylesAddCaregiver, caregiverStyle, caregiverContactInfo, decouplingOption }