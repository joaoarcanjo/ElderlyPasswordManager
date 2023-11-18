import { StyleSheet } from "react-native"

/**
 * Estilos da scroll view com as credenciais
 */
const styleScroolView = StyleSheet.create({
    questionsContainer: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderWidth: 2, // Largura da linha na margem
        borderColor: 'grey', // Cor de fundo
    },
    itemContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: '#DCE0DE', // Cor de fundo
        marginVertical: 8, // Margem vertical entre os itens
    }
})


export { styleScroolView }