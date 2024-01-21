import { StyleSheet } from "react-native"
import { manualButtonBackgroud, manualButtonBorder, lightPurpleBackground, purpleBorder, signupButtonBackgroundU, signupButtonBorderU } from "../../../assets/styles/colors"

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginVertical: 20,
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        flex: 1, 
        justifyContent: 'center',
        borderColor: purpleBorder,
        backgroundColor: lightPurpleBackground
    }
})

const actions = StyleSheet.create({
    sinUpButton: {
        backgroundColor: signupButtonBackgroundU,
        borderColor: signupButtonBorderU
    }
})

const manualCredential = StyleSheet.create({
    logoutButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        borderWidth: 5, // Largura da linha na margem
        backgroundColor: manualButtonBackgroud,
        borderColor: manualButtonBorder,
    },
    logoutButtonText: {
      fontSize: 25,
      color: 'black'
    }
})

export { styles, actions, manualCredential }