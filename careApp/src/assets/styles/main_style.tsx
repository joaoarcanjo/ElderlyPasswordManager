import {StyleSheet} from 'react-native'
import { acceptButtonBackground, acceptButtonBorder, borderColorDark, buttonOptionBackground, buttonOptionBorder, cancelButtonBackground, cancelButtonBorder, cardButtonBackground, cardButtonBorder, color8, copyButtonBackground, copyButtonBorder, darkGrey, editButtonBackgroud, editButtonBorder, filterButtonBackgroud, filterButtonBorder, loginButtonBackground, loginButtonBorder, navigateButtonBackgroud, navigateButtonBorder, optionsButtonBackground, optionsButtonBorder, rejectButtonBackground, rejectButtonBorder, videoButtonBackground, videoButtonBorder, visibilityButtonBackground, visibilityButtonBorder } from './colors'
import { mainBoxTextSize } from './text'


const stylesMainBox = StyleSheet.create({
    pageInfoContainer: {
        borderTopWidth: 2, 
        borderBottomWidth: 2,
        backgroundColor: color8,
        borderColor: borderColorDark,
    },
    pageInfoText: {
        marginHorizontal: '8%',
        fontSize: mainBoxTextSize,
        color: darkGrey
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
    videoButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: videoButtonBackground, // Cor de fundo
        borderColor: videoButtonBorder
    },
    //ESTILO PARA O BOTÃO COM A SETA PARA MAIS INFORMAÇAO
    moreInfoButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: filterButtonBackgroud, // Cor de fundo
        borderColor: filterButtonBorder
    },
    //ESTILO PARA OS BOTOES COM OPÇÃO DE SELECIONADO E NÃO SELECIONADO
    selectedButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: buttonOptionBackground, // Cor de fundo
        borderColor: buttonOptionBorder
    },
    unselectedButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: buttonOptionBackground, // Cor de fundo
        borderColor: buttonOptionBorder
    },
    //BUTOES UTILIZADOS PARA SELECIONAR QUAL O FORMULARIO DE ADICIONAR CREDENCIAL 
    cardButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: cardButtonBackground, // Cor de fundo
        borderColor: cardButtonBorder
    },
    loginButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: loginButtonBackground, // Cor de fundo
        borderColor: loginButtonBorder
    },
    navigateButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: navigateButtonBackgroud, // Cor de fundo
        borderColor: navigateButtonBorder
    },
})

export { stylesMainBox, stylesButtons }