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
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      borderWidth: 2, // Largura da linha na margem
      backgroundColor: greyBackgroud, // Cor de fundo
      borderColor: greyBorder
    },
    button: {
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

const credentialName = StyleSheet.create({
    container: {
        borderBottomLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderBottomRightRadius: 20, // Arredonda o canto inferior direito
        borderTopWidth: 0,
        borderWidth: 2, // Largura do contorno
        borderColor: blackBorder, // Cor do contorno
        backgroundColor: superlightBlueBackgroud
    },
    text: {
      fontSize: 26,
      color: 'black'
    }
})

export { caregiver, permission, credentialName }