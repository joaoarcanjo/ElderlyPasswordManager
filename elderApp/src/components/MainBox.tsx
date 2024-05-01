import React, { useEffect } from "react"
import { View, Text, Keyboard } from "react-native"
import { stylesMainBox } from "../assets/styles/main_style"
import { fontSizeMainBox, fontSizeMainBoxKeyboard } from "../assets/constants"

const MainBox = ({text}: {text: string})  => {

    const [fontSize, setFontSize] = React.useState(fontSizeMainBox)

    useEffect(() => {
        //Os dois primeiros apenas funcionam em IOS. Os dois últimos funcionam em Android.
        const showSubscriptionIOS = Keyboard.addListener('keyboardWillShow', () => setFontSize(fontSizeMainBoxKeyboard))
        const hideSubscriptionIOS = Keyboard.addListener('keyboardWillHide', () => setFontSize(fontSizeMainBox))
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => setFontSize(fontSizeMainBoxKeyboard))
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setFontSize(fontSizeMainBox))
    
        return () => {
            showSubscriptionIOS.remove()
            hideSubscriptionIOS.remove()
            showSubscription.remove()
            hideSubscription.remove()
        }
    }, [])

    return (
        <View style= { { flex: 0.18, flexDirection: 'row'} }>
            <View style={[{flex: 1, marginTop: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesMainBox.pageInfoText, {padding: '3%', fontSize: fontSize}]}>{text}</Text>
            </View>
        </View>
      )
}

export default MainBox