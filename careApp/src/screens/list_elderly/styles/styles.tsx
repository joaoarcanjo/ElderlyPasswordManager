import {StyleSheet} from 'react-native'
import { buttonNormalTextSize, elderlyAccountInfoTextSize, elderlyDecisionOptionsTextSize, elderlyPermissionLabelTextSize } from '../../../assets/styles/text'
import { color8, color7, greyBorder, darkGrey, desvinculateButtonBackgroud, desvinculateButtonBorder, permissionsYesButtonBackground, permissionsYesButtonBorder, permissionsNoButtonBackground, permissionsNoButtonBorder, cancelTextColor, addElderlyButtonBackground, elderlyBackground, elderlyBorder, elderlyReceivedBackground, elderlyReceivedBorder, elderlyWaitingBorder, elderlyWaitingBackground, addElderlyButtonBorder, borderColorDark } from '../../../assets/styles/colors'


/**
 * Estilos da view para adicionar uma nova credencial
 */
export const stylesAddElderly = StyleSheet.create({
    button: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        backgroundColor: addElderlyButtonBackground,
        borderColor: addElderlyButtonBorder,
        borderWidth: 3, // Largura da linha na marge
    },
    buttonText: {
        fontSize: buttonNormalTextSize,
        color: color8,
        fontWeight: 'bold'
    }
})

export const elderlyStyle = StyleSheet.create({
    container: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: elderlyBackground, // Cor de fundo
        borderColor: elderlyBorder,
    },
    newElderlyContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: elderlyReceivedBackground, // Cor de fundo
        borderColor: elderlyReceivedBorder,
        marginBottom: 15,
    },
    sentRequestElderlyContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: elderlyWaitingBackground, // Cor de fundo
        borderColor: elderlyWaitingBorder,
        marginBottom: 15,
    }
})

export const elderlyContactInfo = StyleSheet.create({
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
      fontSize: elderlyAccountInfoTextSize,
      color: darkGrey
    }
})

export const decouplingOption = StyleSheet.create({
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

export const elderly = StyleSheet.create({
    container: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: color7, // Cor de fundo
        borderColor: greyBorder,
        marginVertical: 8, // Margem vertical entre os itens
    }
})

export const permission = StyleSheet.create({
    questionText: {
        fontSize: elderlyPermissionLabelTextSize,
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

export const newElderlyContainer = StyleSheet.create({
    buttonText: {
      fontSize: elderlyDecisionOptionsTextSize,
      fontWeight: 'bold',
      color: color8
    },
    cancelButtonText: {
        fontSize: elderlyDecisionOptionsTextSize,
        color: cancelTextColor,
        fontWeight: 'bold'
    }
})

export const elderlyName = StyleSheet.create({
    container: {
        borderTopWidth: 0,
        borderBottomWidth: 1, // Largura do contorno
        borderColor: greyBorder, // Cor do contorno
        backgroundColor: color7,
        width: '100%',
    }
})

/**
 * Estilos da scroll view com as credenciais
 */
export const styleScroolView = StyleSheet.create({
    credentialsContainer: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderColor: borderColorDark,
        borderWidth: 2, // Largura da linha na margem
    }
}) 