import {StyleSheet} from 'react-native'
import { addCredentialButtonBackgroud, addCredentialButtonBorder, copyButtonBackground, copyButtonBorder, color7, greyBorder, regenerateButtonBackgroud, regenerateButtonBorder, color8 } from '../../../assets/styles/colors';
import { buttonAddCredencialTextSize } from '../../../assets/styles/text';


/**
 * Estilos dos inputs das credenciais
 */
const stylesInputsCredentials = StyleSheet.create({
    inputContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: color7, // Cor de fundo
        borderColor: greyBorder,
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
        fontSize: buttonAddCredencialTextSize,
        color: color8,
        fontWeight: 'bold'
    }
})

const passwordFirstHalf = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito     
        borderBottomWidth: 0,
        backgroundColor: color7, // Cor de fundo
        borderWidth: 2, // Largura da linha na margem
    },
    passwordGenerated: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: color8,
        borderColor: greyBorder,
    },
    copyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: copyButtonBackground,
        borderColor: copyButtonBorder,
    },
    regenerateButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: regenerateButtonBackgroud,
        borderColor: regenerateButtonBorder,
    }
})

export { stylesInputsCredentials, stylesAddCredential, passwordFirstHalf }