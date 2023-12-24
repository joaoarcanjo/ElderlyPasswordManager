import {StyleSheet} from 'react-native'
import { addCaregiverButtonBackgroud, addCaregiverButtonBorder, desvinculateButtonBackgroud, desvinculateButtonBorder, greyBackgroud, greyBorder, permissionsButtonBackground, permissionsButtonBorder, whiteBackgroud } from '../../../assets/styles/colors'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCaregiver = StyleSheet.create({
    button: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        backgroundColor: addCaregiverButtonBackgroud,
        borderColor: addCaregiverButtonBorder,
        borderWidth: 3, // Largura da linha na marge
    },
    buttonText: {
        fontSize: 25,
        color: '#f5f5f5',
        fontWeight: 'bold'
    }
})

const caregiverStyle = StyleSheet.create({
    container: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginVertical: 8, // Margem vertical entre os itens
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

const permissionButton = StyleSheet.create({
    permissionButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: permissionsButtonBackground,
        borderColor: permissionsButtonBorder
    },
    permissionButtonText: {
      fontSize: 25,
      color: 'black'
    },
})


export { permissionButton, stylesAddCaregiver, caregiverStyle, caregiverContactInfo, decouplingOption }