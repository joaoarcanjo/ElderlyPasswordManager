import React from "react"
import { View, Text } from "react-native"
import { stylesMainBox } from "../assets/styles/main_style"

const MainBox = ({text}: {text: string})  => {

    return (
        <View style= { { flex: 0.15, flexDirection: 'row'} }>
            <View style={[{flex: 1, marginTop: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{padding: '5%'}, stylesMainBox.pageInfoText]}>{text}</Text>
            </View>
        </View>
      )
}

export default MainBox