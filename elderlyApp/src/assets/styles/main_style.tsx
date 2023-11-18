import {StyleSheet} from 'react-native'

const stylesMainBox = StyleSheet.create({
    pageInfoContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        marginHorizontal: '8%'
    },
    pageInfoText: {
        fontSize: 35,
        color: 'black'
    }
})

const stylesButtons = StyleSheet.create({
    copyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: '#F5D274',
        borderColor: '#D09C11',
    }
})

export { stylesMainBox, stylesButtons }