import React from "react"
import { View, Image } from "react-native"

const Spinner = () => {
    return (
        <View style={{alignItems: 'center',justifyContent: 'center'}}>
            <Image source={require('../assets/images/spinner6.gif')} style={[{width: 300, height: 300, resizeMode: 'contain'}]}/>
        </View>
    )
}

const ElderlyLoading = () => {
    return (
        <View style={{alignItems: 'center',justifyContent: 'center'}}>
            <Image source={require('../assets/images/bell.gif')} style={[{width: 250, height: 250, resizeMode: 'contain'}]}/>
        </View>
    )
}

export { Spinner, ElderlyLoading }