import {StyleSheet} from 'react-native'
import { addElderlyButtonBackgroud, addElderlyButtonBorder, greyBackgroud, greyBorder, whiteBackgroud, superlightBlueBackgroud, blueBorder, desvinculateButtonBackgroud, desvinculateButtonBorder } from '../../../assets/styles/colors'

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
    },
    sentRequestElderlyContainer: {
        borderRadius: 10, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginBottom: 15,
    }
})

const elderlyContactInfo = StyleSheet.create({
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
    buttonText: {
      fontSize: 25,
      color: 'black'
    },
})

/**
 * Estilos ações sobre idoso
 */
const elderlyOptions = StyleSheet.create({
    openCredentials: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: '#9FCFDD',
        borderColor: '#297D95',
    },
    elderlyMoreInfo: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: '#F5D274',
        borderColor: '#D09C11',
    }
})

const decouplingOption = StyleSheet.create({
    button: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      backgroundColor: desvinculateButtonBackgroud,
      borderColor: desvinculateButtonBorder,
      borderWidth: 3
    },
    buttonText: {
        color: '#f5f5f5'
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

export { elderlyName, decouplingOption, elderlyOptions, newElderlyOptions, stylesAddCaregiver, elderlyStyle, elderlyContactInfo }