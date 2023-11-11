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

export { stylesMainBox }