import React from "react"
import { View, Image } from "react-native"

const Spinner = ({width, height}: {width: number, height: number}) => {
    return (
        <View style={{alignItems: 'center',justifyContent: 'center'}}>
            <Image source={require('../assets/images/spinner6.gif')} style={[{width: width, height: height, resizeMode: 'contain'}]}/>
        </View>
    )
}

const ElderlyLoading = ({width, height}: {width: number, height: number}) => {
    return (
        <View style={{alignItems: 'center',justifyContent: 'center'}}>
            <Image source={require('../assets/images/bell.gif')} style={[{width: width, height: height, resizeMode: 'contain'}]}/>
        </View>
    )
}

export { Spinner, ElderlyLoading }