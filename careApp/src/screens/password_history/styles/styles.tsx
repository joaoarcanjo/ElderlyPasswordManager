import {StyleSheet} from 'react-native'
import { passwordContainerBackgroud, passwordContainerBorder } from '../../../assets/styles/colors'

const styleScroolView = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderWidth: 1 // Largura da linha na margem
    },
    item: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        marginVertical: 8, // Margem vertical entre os itens
        backgroundColor: passwordContainerBackgroud, // Cor de fundo
        borderColor: passwordContainerBorder,
    },
    itemPassword: {
        fontSize: 20,
        color: 'black'
    },
    itemDate: {
        fontSize: 15,
        color: 'black'
    }
})

export { styleScroolView }