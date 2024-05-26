import { StyleSheet } from "react-native"
import { splashScreenTextColor } from "../../../assets/styles/colors"

const splashStyle = StyleSheet.create({
    text: {
        fontSize:40, 
        textAlign: 'center', 
        letterSpacing: 0.5, 
        justifyContent: 'center', 
        color: splashScreenTextColor, 
        marginTop: '20%', 
        fontWeight: 'bold'
    }
})

export { splashStyle }