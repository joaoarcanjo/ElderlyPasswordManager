import {StyleSheet} from 'react-native'
import { addCredentialButtonBackgroud, addCredentialButtonBorder, blackBorder, greyBackgroud, greyBorder, optionsButtonBackgroud, optionsButtonBorder, regenerateButtonBackgroud, regenerateButtonBorder, visibilityButtonBackground, visibilityButtonBorder, whiteBackgroud } from '../../../assets/styles/colors';


/**
 * Estilos dos inputs das credenciais
 */
const stylesInputsCredencials = StyleSheet.create({
    inputContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: blackBorder,
        marginVertical: 8, // Margem vertical entre os itens
    }
})

/**
 * Estilos do botão para adicionar a nova credencial
 */
const stylesAddCredential = StyleSheet.create({
    button: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        backgroundColor: addCredentialButtonBackgroud,
        borderColor: addCredentialButtonBorder,
        borderWidth: 3, // Largura da linha na marge
    },
    buttonText: {
        fontSize: 25,
        color: '#f5f5f5',
        fontWeight: 'bold'
    }
})

const passwordFirstHalf = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito     
        borderBottomWidth: 0,
        backgroundColor: greyBackgroud, // Cor de fundo
        borderWidth: 2, // Largura da linha na margem
    },
    passwordGenerated: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: whiteBackgroud,
        borderColor: greyBorder,
    },
    visibilityButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: visibilityButtonBackground,
        borderColor: visibilityButtonBorder,
    },
    regenerateButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: regenerateButtonBackgroud,
        borderColor: regenerateButtonBorder,
    },
    optionsButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: optionsButtonBackgroud,
        borderColor: optionsButtonBorder,
    }
})

export { stylesInputsCredencials, stylesAddCredential, passwordFirstHalf }