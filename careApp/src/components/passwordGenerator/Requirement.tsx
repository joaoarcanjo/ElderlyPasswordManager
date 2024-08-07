import { TouchableOpacity, View, Image, Text } from "react-native"
import { stylesButtons } from "../../assets/styles/main_style"
import { passwordSecondHalf } from "../../screens/password_generator/styles/styles"
import { options } from "../../screens/credential_interface/styles/styles"
import { decLength, incLength } from "./functions"
import { greyBorder, color7, greenBorder, redBorder } from "../../assets/styles/colors"
import { Switch } from 'react-native-switch'
import { lengthLabel } from "../../assets/constants/constants"

export function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {

  return (
    <View style={[{flex: 0.5, margin: '3%', borderWidth: 2, borderRadius: 15, borderColor: greyBorder, alignItems: 'center'} ]}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '1%', marginHorizontal: '5%', marginVertical: '5%'}, options.requirementLabelText]}>{name}</Text>
      <View style={{marginVertical: '5%'}}>
        <Switch
          value={value}
          onValueChange={() => func()}
          activeText={'On'}
          inActiveText={'Off'}
          circleSize={40}
          barHeight={40}
          circleBorderWidth={3}
          backgroundActive={color7}
          backgroundInactive={color7}
          circleActiveColor={greenBorder}
          circleInActiveColor={redBorder}
          changeValueImmediately={false} // if rendering inside circle, change state immediately or wait for animation to complete
          renderActiveText={false}
          renderInActiveText={false}
        />
      </View>
    </View>
  )
}

export function RequirementLength({setLength, currentLength}: Readonly<{setLength: Function, currentLength: number}>) {

  const minusImage = "../../assets/images/minus.png"
  const plusImage = "../../assets/images/plus.png"
  
  return (
    <View style={[{flexDirection: 'row', alignItems: 'center' }]}>
    
      <View style={[{flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}, passwordSecondHalf.lengthContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[passwordSecondHalf.lengthText, {marginHorizontal: '5%'}]}>{lengthLabel}</Text>
        <TouchableOpacity style={[{flex: 0.30}]} onPress={() => decLength(setLength, currentLength)}>
          <Image source={require(minusImage)} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        <View style={[{flex: 0.40, marginHorizontal: '5%', alignItems: 'center'}, passwordSecondHalf.lengthDisplay]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '1%'}, passwordSecondHalf.numberSelectedText]}>{currentLength}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.30, marginRight: '5%'}]} onPress={() => incLength(setLength, currentLength)}>
          <Image source={require(plusImage)} style={[{width: '100%', height: 45, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}