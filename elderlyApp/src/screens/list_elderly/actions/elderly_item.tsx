import React from "react"
import { View, Text, Image } from "react-native"
import { elderlyStyle } from "../styles/styles"

const caregiverImage = '../../../assets/images/caregiver.png'

export default function CaregiverItem() {

  return (
    <View style={[{flex: 1}, elderlyStyle.container]}>
      <View style={{flex: 1, margin: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require(caregiverImage)} style={[{width: '25%', height: '90%', marginHorizontal: '4%', resizeMode: 'contain'}]}/>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginVertical: '5%' }]}>Elisabeth</Text>
      </View>
    </View>
  )
}