import {StyleSheet} from 'react-native'

const styleScroolView = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderWidth: 2, // Largura da linha na margem
    },
    item: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        marginVertical: 8, // Margem vertical entre os itens
        backgroundColor: '#DCE0DE', // Cor de fundo
        borderColor: '#8c8d8f',
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