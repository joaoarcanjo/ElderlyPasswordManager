import {StyleSheet} from 'react-native'
import { addElderlyButtonBackgroud, addElderlyButtonBorder, greyBackgroud, greyBorder, whiteBackgroud, acceptButtonBackground, acceptButtonBorder, rejectButtonBorder, rejectButtonBackground, superlightBlueBackgroud, blueBorder } from '../../../assets/styles/colors'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCaregiver = StyleSheet.create({
    button: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        backgroundColor: addElderlyButtonBackgroud,
        borderColor: addElderlyButtonBorder,
        borderWidth: 3, // Largura da linha na marge
    },
    buttonText: {
        fontSize: 25,
        color: '#f5f5f5',
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
    }
})

const caregiverContactInfo = StyleSheet.create({
    contactContainer: {
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: greyBackgroud, // Cor de fundo
      borderColor: greyBorder
    },
    accountInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: whiteBackgroud, // Cor de fundo
        borderColor: greyBorder
    },
    accountInfoText: {
      fontSize: 20,
      color: 'black'
    }
})

const newElderlyOptions = StyleSheet.create({
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
    buttonText: {
      fontSize: 25,
      color: 'black'
    },
})

export { newElderlyOptions, stylesAddCaregiver, elderlyStyle, caregiverContactInfo }