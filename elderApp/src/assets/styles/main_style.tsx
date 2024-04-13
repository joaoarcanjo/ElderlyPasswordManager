import {StyleSheet} from 'react-native'
import { acceptButtonBackground, acceptButtonBorder, blueBorder, cancelButtonBackground, cancelButtonBorder, copyButtonBackground, copyButtonBorder, darkGreenBorder, greyBackgroud, greyBorder, lightGreenBackgroud, lightOrangeBackground, lightOrangeBorder, lightPurpleBackground, orangeBorder, purpleBorder, regenerateButtonBackgroud, regenerateButtonBorder, rejectButtonBackground, rejectButtonBorder, saveButtonBackground, saveButtonBorder, superLightOrangeBackground, superlightBlueBackgroud, superlightGreenBackground, visibilityButtonBackground, visibilityButtonBorder, whiteBackgroud } from './colors'

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
        borderWidth: 3.0, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    mainSlimConfig: {
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2.5, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    acceptButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: acceptButtonBackground,
        borderColor: acceptButtonBorder
    },
    cancelButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: cancelButtonBackground,
        borderColor: cancelButtonBorder
    },
    rejectButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: rejectButtonBackground,
        borderColor: rejectButtonBorder
    },
    copyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: copyButtonBackground,
        borderColor: copyButtonBorder
    },
    regenerateButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: regenerateButtonBackgroud,
        borderColor: regenerateButtonBorder,
    },
    saveButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: saveButtonBackground, // Cor de fundo
        borderColor: saveButtonBorder
    },
    visibilityButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: visibilityButtonBackground, // Cor de fundo
        borderColor: visibilityButtonBorder
    },
    blueButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: superlightBlueBackgroud, // Cor de fundo
        borderColor: blueBorder
    },
    greenButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: lightGreenBackgroud, // Cor de fundo
        borderColor: darkGreenBorder
    },
    lightGreenButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: superlightGreenBackground, // Cor de fundo
        borderColor: darkGreenBorder
    },
    greyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder
    },
    purpleButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: lightPurpleBackground, // Cor de fundo
        borderColor: purpleBorder
    },
    orangeButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: lightOrangeBackground, // Cor de fundo
        borderColor: orangeBorder
    },
    lightOrangeButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: superLightOrangeBackground, // Cor de fundo
        borderColor: lightOrangeBorder
    },
    borderOrangeButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: whiteBackgroud, // Cor de fundo
        borderColor: lightOrangeBorder
    }
})

export { stylesMainBox, stylesButtons }