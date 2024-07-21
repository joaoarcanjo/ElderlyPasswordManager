import { StyleSheet } from "react-native"
import { itemContainerBackgroud, itemContainerBorder, questionButtonNotSelected, questionButtonNotSelectedBorder, questionButtonSelectedBackground, questionButtonSelectedBorder } from "../../../assets/styles/colors"

/**
 * Estilos da scroll view com as credenciais
 */
const styleScroolView = StyleSheet.create({
    questionsContainer: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderWidth: 2, // Largura da linha na margem
    },
    itemContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: itemContainerBackgroud, // Cor de fundo
        borderColor: itemContainerBorder,
        marginVertical: 4, // Margem vertical entre os itens
    }
})

const styleSectionButton = StyleSheet.create({
    sectionButtonSelected: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: questionButtonSelectedBackground, // Cor de fundo
        borderColor: questionButtonSelectedBorder,
    },
    sectionButtonNotSelected: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: questionButtonNotSelected, // Cor de fundo
        borderColor: questionButtonNotSelectedBorder,
    }
})

const stylesVideo = StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
    },
    video: {
      width: 350,
      height: 275,
    },
    controlsContainer: {
      padding: 10,
    },
})

export { styleScroolView, stylesVideo, styleSectionButton }