import { TouchableOpacity, View, Image, Text } from "react-native"
import { stylesButtons } from "../../assets/styles/main_style"
import { passwordSecondHalf } from "../../screens/password_generator/styles/styles"
import { options } from "../../screens/credential_interface/styles/styles"
import { decLength, incLength } from "./functions"

export function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {

  const crossImage = "../../assets/images/cross.png"
  const checkImage = "../../assets/images/check.png"

  const style = value ? stylesButtons.whiteButton : stylesButtons.greyButton

  return (
    <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.mainConfig, style]} onPress={() => {func()}}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '1%', marginHorizontal: '5%'}, options.permissionsButtonText]}>{name}</Text>
      {value ? 
        <Image source={require(checkImage)} style={[{width: '100%', height: 50, resizeMode: 'contain', marginVertical: '5%'}]}/> :
        <Image source={require(crossImage)} style={[{width: '100%', height: 50, resizeMode: 'contain', marginVertical: '5%'}]}/> 
      }
    </TouchableOpacity>
  )
}

export function RequirementLength({setLength, currentLength}: Readonly<{setLength: Function, currentLength: number}>) {

  const minusImage = "../../assets/images/minus.png"
  const plusImage = "../../assets/images/plus.png"
  
  return (
    <View style={[{flexDirection: 'row', alignItems: 'center' }]}>
      <View style={[{flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}]}>
        <TouchableOpacity style={[{flex: 0.35}]} onPress={() => decLength(setLength, currentLength)}>
          <Image source={require(minusImage)} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        <View style={[{flex: 0.3,  alignItems: 'center'}, passwordSecondHalf.lengthDisplay]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '1%'}, passwordSecondHalf.numberSelectedText]}>{currentLength}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.35}]} onPress={() => incLength(setLength, currentLength)}>
          <Image source={require(plusImage)} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}