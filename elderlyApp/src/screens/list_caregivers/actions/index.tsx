import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Button, ScrollView } from 'react-native'
import { permissionButton } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import AddCaregiver from './addCaregiver'
import CaregiverItem from './caregiverItem'
import { Caregiver } from '../../../database/types'
import { getCaregivers } from '../../../database'
import { caregiverListUpdated } from './state'

function CaregiversList() {

  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const navigation = useNavigation<StackNavigationProp<any>>()
  
  const permissions = () => {
    navigation.navigate('Permissions')
  }

  const refreshValue = () => {
    getCaregivers().then(value => setCaregivers(value))
  }

  useEffect(() => {
    const subscription = caregiverListUpdated.subscribe(() => {
      getCaregivers().then(value => setCaregivers(value))
    })
    return () => subscription.unsubscribe()
}, [caregiverListUpdated])


  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        
        {caregivers.map((caregiver) => <CaregiverItem key={caregiver.id} name={caregiver.name} phone={caregiver.phoneNumber} email={caregiver.email} setRefresh={refreshValue} ></CaregiverItem>)}
        {caregivers.length === 0 && <AddCaregiver number={1} setRefresh={refreshValue} />}
        {caregivers.length < 2 && <AddCaregiver number={2} setRefresh={refreshValue} />}
        <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '20%'}, permissionButton.permissionButton, stylesButtons.mainConfig]} onPress={permissions}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[permissionButton.permissionButtonText]}>Permissões</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function Caregivers() {
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Cuidadores'}/>
      {/*<Button title="TEST" onPress={() => navigation.push('ChatTest')}></Button>*/}
      <CaregiversList/>
      <Navbar/>
    </View>
  )
}