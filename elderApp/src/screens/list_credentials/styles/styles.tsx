import {StyleSheet} from 'react-native'
import { addCredentialButtonBackgroud, addCredentialButtonBorder, borderColorDark, cardOrLoginOptionButtonNotSelectedBackground, cardOrLoginOptionButtonNotSelectedBorder, cardOrLoginOptionButtonSelectedBackground, cardOrLoginOptionButtonSelectedBorder, credentialItemBackgroud, credentialItemBorder, searchButtonBackgroud, searchButtonBorder, color8 } from '../../../assets/styles/colors'
import { buttonNormalTextSize } from '../../../assets/styles/text'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCredential = StyleSheet.create({
    addCredentialButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: addCredentialButtonBackgroud, // Cor de fundo
        borderColor: addCredentialButtonBorder
    },
    addCredentialButtonText: {
        fontSize: buttonNormalTextSize,
        color: color8
    }
})

/**
 * Estilos da scroll view com as credenciais
 */
const styleScroolView = StyleSheet.create({
    credentialsContainer: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderColor: borderColorDark,
        borderWidth: 2, // Largura da linha na margem
    },
    credentialContainer: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: credentialItemBackgroud,
        borderColor: credentialItemBorder,
    }
})

const styleSearch = StyleSheet.create({
    button: {
        borderRadius: 15,
        backgroundColor: searchButtonBackgroud,
        borderColor: searchButtonBorder
    },
    optionButtonSelected: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: cardOrLoginOptionButtonSelectedBackground, // Cor de fundo
        borderColor: cardOrLoginOptionButtonSelectedBorder,
    },
    optionButtonNotSelected: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: cardOrLoginOptionButtonNotSelectedBackground, // Cor de fundo
        borderColor: cardOrLoginOptionButtonNotSelectedBorder,
    }
})

export { stylesAddCredential, styleScroolView, styleSearch }