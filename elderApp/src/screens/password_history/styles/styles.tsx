import {StyleSheet} from 'react-native'
import { borderColorDark, color7, darkGrey, greyBorder } from '../../../assets/styles/colors'
import { historyDateTextSize, historyPasswordTextSize } from '../../../assets/styles/text'

const styleScroolView = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderColor: borderColorDark,
        borderWidth: 2, // Largura da linha na marge
    },
    item: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        marginVertical: 8, // Margem vertical entre os itens
        backgroundColor: color7, // Cor de fundo
        borderColor: greyBorder,
    },
    itemPassword: {
        fontSize: historyPasswordTextSize,
        color: darkGrey
    },
    itemDate: {
        fontSize: historyDateTextSize,
        color: darkGrey
    }
})

export { styleScroolView }