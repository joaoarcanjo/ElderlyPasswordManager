import {StyleSheet} from 'react-native'
import { copyButtonBackground, copyButtonBorder, whiteBackgroud } from './colors'

const stylesMainBox = StyleSheet.create({
    pageInfoContainer: {
        borderTopWidth: 1, 
        borderBottomWidth: 1,
        backgroundColor: whiteBackgroud
    },
    pageInfoText: {
        marginHorizontal: '8%',
        fontSize: 45,
        color: 'black'
    }
})

const stylesButtons = StyleSheet.create({
    mainConfig: {
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 3.5, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    copyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: copyButtonBackground,
        borderColor: copyButtonBorder
    }
})

export { stylesMainBox, stylesButtons }