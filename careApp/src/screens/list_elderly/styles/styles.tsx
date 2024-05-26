import {StyleSheet} from 'react-native'
import { greyBackgroud, greyBorder, whiteBackgroud, superlightBlueBackgroud, blueBorder, desvinculateButtonBackgroud, desvinculateButtonBorder, addElderlyButtonBackground, addElderlyButtonBorder, openCredentialsButtonBackground, openCredentialsButtonBorder, contactInfoButtonBackgroud, contactInfoButtonBorder } from '../../../assets/styles/colors'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCaregiver = StyleSheet.create({
    addCaregiver: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: addElderlyButtonBackground,
        borderColor: addElderlyButtonBorder,
        borderWidth: 3
    },
    buttonText: {
        fontSize: 25,
        color: whiteBackgroud,
        fontWeight: 'bold'
    }
})

const elderlyStyle = StyleSheet.create({
    container: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: whiteBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginBottom: 15,
    },
    newElderlyContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: superlightBlueBackgroud, // Cor de fundo
        borderColor: blueBorder,
        marginBottom: 15,
    },
    sentRequestElderlyContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginBottom: 15,
    },
})

const elderlyContactInfo = StyleSheet.create({
    accountInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: contactInfoButtonBackgroud, // Cor de fundo
        borderColor: contactInfoButtonBorder
    },
    credentialsButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: openCredentialsButtonBackground, // Cor de fundo
        borderColor: openCredentialsButtonBorder
    },
    accountInfoText: {
      fontSize: 20,
      color: 'black'
    }
})

const newElderlyOptions = StyleSheet.create({
    buttonText: {
      fontSize: 25,
      color: 'black'
    },
})

const decouplingOption = StyleSheet.create({
    button: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: desvinculateButtonBackgroud,
      borderColor: desvinculateButtonBorder,
      borderWidth: 3
    },
    buttonText: {
        color: whiteBackgroud
    }
})

const elderlyName = StyleSheet.create({
    container: {
        borderTopWidth: 0,
        borderBottomWidth: 1, // Largura do contorno
        borderColor: greyBorder, // Cor do contorno
        backgroundColor: greyBackgroud,
        width: '100%',
    }
})

export { elderlyName, decouplingOption, newElderlyOptions, stylesAddCaregiver, elderlyStyle, elderlyContactInfo }