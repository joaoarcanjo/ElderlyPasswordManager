import React,{useState} from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { permission, credentialName, caregiver } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types'
import { useNavigation } from '@react-navigation/native'

const caregiverImage = '../../../assets/images/caregiver.png'
const crossImage = "../../../assets/images/cross.png"
const checkImage = "../../../assets/images/check.png"

function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {
  return (
    <TouchableOpacity style={[{flex: 0.50, marginTop:'2%', marginHorizontal: '4%'}, permission.button, stylesButtons.mainConfig]} onPress={() => func()}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[permission.text]}>{name}</Text>
      <View style={{flex: 0.75, width: '100%', marginTop: '5%'}}>
        {value ? 
        <Image source={require(checkImage)} style={[{width: '100%', height: '100%', resizeMode: 'contain'}]}/>:
        <Image source={require(crossImage)} style={[{width: '100%', height: '100%', resizeMode: 'contain'}]}/>}
      </View>
    </TouchableOpacity>
  )
}

function CaregiverPermissionsItem() {

  const [readPermission, setReadPermission] = useState<boolean>(false)
  const [writePermission, setWritePermission] = useState<boolean>(false)

  const readFunction = () => {setReadPermission(!readPermission)}
  const writeFunction = () => {setWritePermission(!writePermission)}

  return (
    <View style={[{flex: 0.5, margin: '3%'}, caregiver.container]}>
      <View style={{flex: 0.45, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require(caregiverImage)} style={[{width: '50%', height: '70%', resizeMode: 'contain'}]}/>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{width: '50%', fontSize: 25, marginTop: '5%' }]}>Elisabeth</Text>
      </View>
      <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }}/>
      <View style={{flex: 0.65, marginBottom:'3%', flexDirection: 'row'}}>
        <Requirement name={'Leitura'} value={readPermission} func={readFunction}/>
        <Requirement name={'Escrita'} value={writePermission} func={writeFunction}/>
      </View>
    </View>
  )
}

function CaregiversPermissions() {
  return (
    <View style={{ flex: 0.65, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', marginTop: '5%'}]}>
        <CaregiverPermissionsItem/>
      </View>
    </View>
  )
}

function CredentialNameBox({name}: Readonly<{name: string}>) {
  return (
    <TouchableOpacity style= {{ flex: 0.08, flexDirection: 'row'}}>
      <View style={[{flex: 1, marginHorizontal: '12%', justifyContent: 'center',  alignItems: 'center'}, credentialName.container]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{padding: '5%'}, credentialName.text]}>{name}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function PermissionsPage({ route }: Readonly<{route: any}>) {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Permissões'}/>
      <CredentialNameBox name={route.params.platform}/>
      <CaregiversPermissions/>
      <Navbar/>
    </View>
  )
}