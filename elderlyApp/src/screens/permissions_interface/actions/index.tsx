import React,{useState} from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { permission, caregiver } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'

const caregiverImage = '../../../assets/images/caregiver.png'
const crossImage = "../../../assets/images/cross.png"
const checkImage = "../../../assets/images/check.png"

function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {
  return (
    <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, permission.container, stylesButtons.mainConfig]} onPress={() => func()}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%'}, permission.text]}>{name}</Text>{value ? 
        <Image source={require(checkImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>:
        <Image source={require(crossImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>}
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
      <View style={{flex: 0.65, marginBottom:'3%'}}>
        <Requirement name={'Criar perfis'} value={readPermission} func={readFunction}/>
        <Requirement name={'Alterar perfis'} value={writePermission} func={writeFunction}/>
      </View>
    </View>
  )
}

function CaregiversPermissions() {
  return (
    <View style={{ flex: 0.73, flexDirection: 'row', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', marginTop: '5%'}]}>
        <CaregiverPermissionsItem/>
      </View>
    </View>
  )
}

export default function PermissionsPage() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Permissões'}/>
      <CaregiversPermissions/>
      <Navbar/>
    </View>
  )
}