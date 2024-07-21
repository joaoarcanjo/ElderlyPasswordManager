import {StyleSheet} from 'react-native'
import { addCredentialButtonBackgroud, addCredentialButtonBorder, cardOrLoginOptionButtonNotSelectedBackground, cardOrLoginOptionButtonNotSelectedBorder, cardOrLoginOptionButtonSelectedBackground, cardOrLoginOptionButtonSelectedBorder, credentialItemBackgroud, credentialItemBorder, searchButtonBackgroud, searchButtonBorder, whiteBackgroud } from '../../../assets/styles/colors'

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
        fontSize: 20,
        color: whiteBackgroud
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
        borderWidth: 1, // Largura da linha na margem
    },
    credentialContainer: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: credentialItemBackgroud,
        borderColor: credentialItemBorder,
    },
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