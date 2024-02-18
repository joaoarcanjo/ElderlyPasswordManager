import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { permissionButton } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import AddCaregiver from './addCaregiver'
import CaregiverItem from './caregiverItem'

function CaregiversList() {

  const navigation = useNavigation<StackNavigationProp<any>>()
  
  const permissions = () => {
    navigation.navigate('Permissions')
  }

  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <CaregiverItem/>
        <AddCaregiver/>
        <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '20%'}, permissionButton.permissionButton, stylesButtons.mainConfig]} onPress={permissions}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[permissionButton.permissionButtonText]}>Permissões</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

//TODO: construir um main componente para ter receber apenas os components childs de cada page
export default function Caregivers() {
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Cuidadores'}/>
      <Button title="TEST" onPress={() => navigation.push('ChatTest')}></Button>
      <CaregiversList/>
      <Navbar/>
    </View>
  )
}