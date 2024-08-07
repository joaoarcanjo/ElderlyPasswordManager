import { StyleSheet } from "react-native"
import { historyButtonBackgroud, historyButtonBorder, splashScreenTextColor1, splashScreenTextColor2 } from "../../../assets/styles/colors"
import { mainBoxTextSize, splashScreenTextSize } from "../../../assets/styles/text"

const splashStyle = StyleSheet.create({
    text1: {
        fontSize: mainBoxTextSize, 
        textAlign: 'center', 
        letterSpacing: 0.5, 
        justifyContent: 'center', 
        color: splashScreenTextColor1, 
        fontWeight: 'bold'
    },
    text2: {
        fontSize: splashScreenTextSize, 
        textAlign: 'center', 
        letterSpacing: 0.5, 
        justifyContent: 'center', 
        color: splashScreenTextColor2, 
        marginVertical: '10%',
        fontWeight: 'bold'
    },
    continueButton: {
        borderRadius: 15, // Define o raio dos cantos para arredondá-los
        backgroundColor: historyButtonBackgroud,
        borderColor: historyButtonBorder,
    }
})

export { splashStyle }