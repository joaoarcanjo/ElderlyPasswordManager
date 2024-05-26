import { StyleSheet } from "react-native"
import { superlightBlueBackgroud, signinButtonBackground, signinButtonBorder, signupButtonBackground, signupButtonBorder, blueBorder } from "../../../assets/styles/colors"

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginVertical: 20,
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        flex: 1, 
        justifyContent: 'center',
        borderColor: blueBorder,
        backgroundColor: superlightBlueBackgroud
    }
})

const actions = StyleSheet.create({
    signInButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: signinButtonBackground,
        borderColor: signinButtonBorder
    },
    sinUpButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: signupButtonBackground,
        borderColor: signupButtonBorder
    }
})


export { styles, actions }