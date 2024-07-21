import {StyleSheet} from 'react-native'
import { addCaregiverButtonBackground, addCaregiverButtonBorder, cancelTextColor, caregiverReceivedBackground, caregiverReceivedBorder, caregiverWaitingBackground, caregiverWaitingBorder, desvinculateButtonBackgroud, desvinculateButtonBorder, color7, greyBorder, permissionsNoButtonBackground, permissionsNoButtonBorder, permissionsYesButtonBackground, permissionsYesButtonBorder, color8, darkGrey, caregiverBackground, caregiverBorder } from '../../../assets/styles/colors'
import { buttonNormalTextSize, caregiverAccountInfoTextSize, caregiverDecisionOptionsTextSize, caregiverPermissionLabelTextSize } from '../../../assets/styles/text'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCaregiver = StyleSheet.create({
    button: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        backgroundColor: addCaregiverButtonBackground,
        borderColor: addCaregiverButtonBorder,
        borderWidth: 3, // Largura da linha na marge
    },
    buttonText: {
        fontSize: buttonNormalTextSize,
        color: color8,
        fontWeight: 'bold'
    }
})

const caregiverStyle = StyleSheet.create({
    container: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: caregiverBackground, // Cor de fundo
        borderColor: caregiverBorder,
        marginVertical: 8, // Margem vertical entre os itens
    },
    newCaregiverContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: caregiverReceivedBackground, // Cor de fundo
        borderColor: caregiverReceivedBorder,
        marginBottom: 15,
    },
    sentRequestCaregiverContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: caregiverWaitingBackground, // Cor de fundo
        borderColor: caregiverWaitingBorder,
        marginBottom: 15,
    }
})

const caregiverContactInfo = StyleSheet.create({
    contactContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: color7, // Cor de fundo
      borderColor: greyBorder
    },
    accountInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: color8, // Cor de fundo
        borderColor: greyBorder
    },
    accountInfoText: {
      fontSize: caregiverAccountInfoTextSize,
      color: darkGrey
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
        fontSize: buttonNormalTextSize, 
        color: '#f5f5f5'
    }
})

const caregiver = StyleSheet.create({
    container: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: color7, // Cor de fundo
        borderColor: greyBorder,
        marginVertical: 8, // Margem vertical entre os itens
    }
})

const permission = StyleSheet.create({
    questionText: {
        fontSize: caregiverPermissionLabelTextSize,
        color: darkGrey
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
    },/*
    yesButtonText: {
        color: color8
    },
    noButtonText: {
        color: color8
    },*/
})

const newCaregiverContainer = StyleSheet.create({
    buttonText: {
      fontSize: caregiverDecisionOptionsTextSize,
      fontWeight: 'bold',
      color: color8
    },
    cancelButtonText: {
        fontSize: caregiverDecisionOptionsTextSize,
        color: cancelTextColor,
        fontWeight: 'bold'
    }
})

export { newCaregiverContainer, caregiver, permission, stylesAddCaregiver, caregiverStyle, caregiverContactInfo, decouplingOption }