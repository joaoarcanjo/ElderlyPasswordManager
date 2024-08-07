import {StyleSheet} from 'react-native'
import { historyButtonBackgroud, historyButtonBorder, firstHalfContainerBackgroud, greyBorder, copyButtonBackground, copyButtonBorder, regenerateButtonBackgroud, regenerateButtonBorder, passwordOptionButtonBackgroud, passwordOptionButtonBorder, borderColorDark, color8, darkGrey } from '../../../assets/styles/colors'
import { generatorRequirementLabelTextSize, generatorLengthLabelTextSize, generatorNumberSelectedTextSize } from '../../../assets/styles/text'

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
        backgroundColor: firstHalfContainerBackgroud, // Cor de fundo
        borderColor: borderColorDark,
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

const passwordSecondHalf = StyleSheet.create({
    container: {
        borderRadius: 20, // Arredonda o canto inferior direito  
        backgroundColor: color8, // Cor de fundo
        borderColor: borderColorDark,
        borderWidth: 2, // Largura da linha na marge
    }, 
    requirementsText: {
        fontSize: generatorRequirementLabelTextSize,
    },
    lengthContainer: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: passwordOptionButtonBackgroud, // Cor de fundo
        borderColor: passwordOptionButtonBorder,
    },
    lengthText: {
        fontSize: generatorLengthLabelTextSize,
        color: darkGrey
    },
    lengthDisplay: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: color8,
        borderColor: greyBorder
    },
    numberSelectedText: {
        fontSize: generatorNumberSelectedTextSize,
        color: darkGrey
    }
})

export { historyStyle, passwordFirstHalf, passwordSecondHalf }