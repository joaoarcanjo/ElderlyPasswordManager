import {StyleSheet} from 'react-native'
import { blackBorder, greyBackgroud, greyBorder, superlightBlueBackgroud, whiteBackgroud } from '../../../assets/styles/colors'

const caregiver = StyleSheet.create({
    container: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: greyBorder,
        marginVertical: 8, // Margem vertical entre os itens
    }
})

const permission = StyleSheet.create({
    container: {
      borderRadius: 15, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: whiteBackgroud, // Cor de fundo
      borderColor: greyBorder
    },
    text: {
      fontSize: 20,
      color: 'black'
    }
})

export { caregiver, permission }