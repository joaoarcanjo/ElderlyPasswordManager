import {StyleSheet} from 'react-native'

/**
 * Estilos da view que informa qual é a página atual
 */
const historyStyle = StyleSheet.create({
    historyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: '#9FCFDD',
        borderColor: '#297D95',
    }
})

const passwordFirstHalf = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito     
        borderBottomWidth: 0,
        backgroundColor: '#DCE0DE', // Cor de fundo
        borderWidth: 2, // Largura da linha na margem
    },
    passwordGenerated: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: 'white',
        borderColor: '#8c8d8f',
    },
    copyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: '#F5D274',
        borderColor: '#D09C11',
    },
    regenerateButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 6, // Largura da linha na margem
        backgroundColor: '#7FCA82',
        borderColor: '#449447',
    }
})

const passwordSecondHalf = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito     
        borderBottomWidth: 0,
        backgroundColor: 'white', // Cor de fundo
        borderWidth: 2, // Largura da linha na margem
    }, 
    requirementsText: {
        fontSize: 20,
        color: 'black'
    },
    lengthContainer: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: '#DCE0DE', // Cor de fundo
        borderColor: '#8c8d8f',
    },
    lengthText: {
        fontSize: 25,
        color: 'black'
    },
    lengthDisplay: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: 'white',
        borderColor: '#8c8d8f'
    },
    numberSelectedText: {
        fontSize: 25,
        color: 'black'
    }
})

export { historyStyle, passwordFirstHalf, passwordSecondHalf }