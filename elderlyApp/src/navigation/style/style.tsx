import { StyleSheet } from "react-native";
import { homePageButtonBackground, homePagebuttonBorder, navigationBackground, navigationBorder, previousbuttonBackground, previousbuttonBorder } from "../../assets/styles/colors";

const navigationStyle = StyleSheet.create({
    pageInfoContainer: {
      borderTopWidth: 3, // Largura da linha na margem
      borderColor: navigationBorder, // Cor da linha na margem (cinza escuro)
      backgroundColor: navigationBackground,
    },
    backButton: {
      borderWidth: 3,
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      backgroundColor: previousbuttonBackground,
      borderColor: previousbuttonBorder,
    },
    initialButton: {
      borderWidth: 3,
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      backgroundColor: homePageButtonBackground,
      borderColor: homePagebuttonBorder,
    }
})

export default navigationStyle 