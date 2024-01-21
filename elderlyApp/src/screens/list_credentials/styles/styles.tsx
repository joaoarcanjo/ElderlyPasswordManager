import {StyleSheet} from 'react-native'

/**
 * Estilos da view para adicionar uma nova credencial
 */
const stylesAddCredential = StyleSheet.create({
    addCredentialButton: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: '#58b859',
        borderColor: '#449447',
    },
    addCredentialButtonText: {
        fontSize: 25,
        color: '#f5f5f5'
    }
})

/**
 * Estilos da scroll view com as credenciais
 */
const styleScroolView = StyleSheet.create({
    credencialsContainer: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderWidth: 1, // Largura da linha na margem
    },
    itemContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: '#DCE0DE', // Cor de fundo
        borderColor: '#8c8d8f',
        marginVertical: 8, // Margem vertical entre os itens
    },
    itemCopyUsername: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: '#9FCFDD',
        borderColor: '#297D95',
    },
    itemCopyPassword: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        backgroundColor: '#F5D274',
        borderColor: '#D09C11',
    },
    itemMoreInfoButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: '#F3E7AB',
        borderColor: '#E1C748',
    }
})


export { stylesAddCredential, styleScroolView }