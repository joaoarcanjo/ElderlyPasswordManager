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
        backgroundColor: '#F5D274',
        borderColor: '#D09C11',
        borderWidth: 3, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    }
})

export { stylesMainBox, stylesButtons }