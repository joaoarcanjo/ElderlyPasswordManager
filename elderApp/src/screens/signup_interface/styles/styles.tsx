import { StyleSheet } from "react-native"
import { signupButtonBackgroundU, signupButtonBorderU, signupPageBackground, signupPageBorder } from "../../../assets/styles/colors"

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginVertical: 20,
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 3, // Largura da linha na margem
        flex: 1, 
        justifyContent: 'center',
        borderColor: signupPageBorder,
        backgroundColor: signupPageBackground
    }
})

const actions = StyleSheet.create({
    sinUpButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: signupButtonBackgroundU,
        borderColor: signupButtonBorderU
    }
})

export { styles, actions }