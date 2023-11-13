import { StyleSheet } from "react-native";

const navigationStyle = StyleSheet.create({
    pageInfoContainer: {
      borderTopWidth: 3, // Largura da linha na margem
      borderColor: '#83419F', // Cor da linha na margem (cinza escuro)
      backgroundColor: '#DBB8E9',
    },
    backButton: {
      borderWidth: 3,
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      backgroundColor: '#9FCFDD',
      borderColor: '#297D95',
    },
    initialButton: {
      borderWidth: 3,
      borderRadius: 20, // Define o raio dos cantos para arredondá-los
      backgroundColor: '#F197AC',
      borderColor: '#BC5E74',
    }
})

export default navigationStyle 