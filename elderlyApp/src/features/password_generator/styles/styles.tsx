import {StyleSheet} from 'react-native'
import { copyButtonBackground, copyButtonBorder, greyBackgroud, greyBorder, historyButtonBackgroud, historyButtonBorder, regenerateButtonBackgroud, regenerateButtonBorder, whiteBackgroud } from '../../../assets/styles/colors'

/**
 * Estilos da view que informa qual é a página atual
 */
const historyStyle = StyleSheet.create({
    historyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: historyButtonBackgroud,
        borderColor: historyButtonBorder,
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

const passwordSecondHalf = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito     
        borderBottomWidth: 0,
        backgroundColor: whiteBackgroud, // Cor de fundo
        borderWidth: 2, // Largura da linha na margem
    }, 
    requirementsText: {
        fontSize: 20,
        color: 'black'
    },
    lengthContainer: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
    },
    lengthText: {
        fontSize: 25,
        color: 'black'
    },
    lengthDisplay: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: whiteBackgroud,
        borderColor: greyBorder
    },
    numberSelectedText: {
        fontSize: 40,
        color: 'black'
    }
})

export { historyStyle, passwordFirstHalf, passwordSecondHalf }