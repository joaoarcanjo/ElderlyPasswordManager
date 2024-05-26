import {StyleSheet} from 'react-native'
import { acceptButtonBackground, acceptButtonBorder, blueBorder, cancelButtonBackground, cancelButtonBorder, copyButtonBackground, copyButtonBorder, darkGreenBorder, editButtonBackgroud, editButtonBorder, greyBorder, lightOrangeBackground, lightPurpleBackground, navigateButtonBackgroud, navigateButtonBorder, optionsButtonBackground, optionsButtonBorder, orangeBorder, purpleBorder, rejectButtonBackground, rejectButtonBorder, superlightBlueBackgroud, superlightGreenBackground, visibilityButtonBackground, visibilityButtonBorder, whiteBackgroud } from './colors'


const stylesMainBox = StyleSheet.create({
    pageInfoContainer: {
        borderTopWidth: 2, 
        borderBottomWidth: 2,
        backgroundColor: whiteBackgroud,
        borderBlockEndColor: greyBorder,
        borderBlockStartColor: greyBorder,
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
    mainConfigNotCenter: {
        borderWidth: 2.5, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    mainSlimConfigNotCenter: {
        borderWidth: 2, // Largura da linha na margem
        elevation: 3, // Android
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    editButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: editButtonBackgroud, // Cor de fundo
        borderColor: editButtonBorder
    },
    
    acceptButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: acceptButtonBackground,
        borderColor: acceptButtonBorder
    },
    rejectButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: rejectButtonBackground,
        borderColor: rejectButtonBorder
    },
    cancelButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: cancelButtonBackground,
        borderColor: cancelButtonBorder
    },
    optionsButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: optionsButtonBackground, // Cor de fundo
        borderColor: optionsButtonBorder
    },
    copyButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: copyButtonBackground,
        borderColor: copyButtonBorder
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
    //ESTILO PARA O BOTÃO COM A SETA PARA MAIS INFORMAÇAO
    moreInfoButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: whiteBackgroud, // Cor de fundo
        borderColor: greyBorder
    },
    //ESTILO PARA OS BOTOES COM OPÇÃO DE SELECIONADO E NÃO SELECIONADO
    selectedButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: superlightGreenBackground, // Cor de fundo
        borderColor: darkGreenBorder
    },
    unselectedButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: whiteBackgroud, // Cor de fundo
        borderColor: greyBorder
    },
    //BUTOES UTILIZADOS PARA SELECIONAR QUAL O FORMULARIO DE ADICIONAR CREDENCIAL 
    cardButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: lightPurpleBackground, // Cor de fundo
        borderColor: purpleBorder
    },
    loginButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: lightOrangeBackground, // Cor de fundo
        borderColor: orangeBorder
    },
    navigateButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: navigateButtonBackgroud, // Cor de fundo
        borderColor: navigateButtonBorder
    },
})

export { stylesMainBox, stylesButtons }