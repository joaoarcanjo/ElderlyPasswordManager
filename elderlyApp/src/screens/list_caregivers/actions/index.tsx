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
import { getCaregiversArray } from '../../../firebase/firestore/functionalities'
import { useSessionInfo } from '../../../firebase/authentication/session'

interface CaregiverPermission {
  canRead: boolean,
  canWrite: boolean,
  caregiver: Caregiver
}

async function getCaregiversPermissions(userId: string): Promise<CaregiverPermission[]> {
  const caregivers = await getCaregivers()
  const readCaregivers = await getCaregiversArray(userId, 'readCaregivers')
  const writeCaregivers = await getCaregiversArray(userId, 'writeCaregivers')

  let caregiversPermissions: CaregiverPermission[] = []

  caregivers.forEach((caregiver) => {
    caregiversPermissions.push({
      canRead: readCaregivers.includes(caregiver.id),
      canWrite: writeCaregivers.includes(caregiver.id),
      caregiver
    })
  })
  return caregiversPermissions
}

function CaregiversList() {

  const [caregivers, setCaregivers] = useState<CaregiverPermission[]>([])
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { userId } = useSessionInfo()
  
  const permissions = () => {
    navigation.navigate('Permissions')
  }

  const refreshValue = async () => {
    const caregiversPermissions = await getCaregiversPermissions(userId)
    setCaregivers(caregiversPermissions)
  }

  useEffect(() => {
    caregiverListUpdated.subscribe(() => {refreshValue()})
      //return () => subscription.unsubscribe()
  }, [caregiverListUpdated])


  return (
    <View style = {{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
    <View style = {[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        
        {caregivers.map((item) => <CaregiverItem key={item.caregiver.id} name={item.caregiver.name} phone={item.caregiver.phoneNumber} email={item.caregiver.email} setRefresh={refreshValue} id={item.caregiver.id} canWrite={false} ></CaregiverItem>)}
        {caregivers.length === 0 && <AddCaregiver number={1} setRefresh={refreshValue} />}
        {caregivers.length < 2 && <AddCaregiver number={2} setRefresh={refreshValue} />}
        {/*
        <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '20%'}, permissionButton.permissionButton, stylesButtons.mainConfig]} onPress={permissions}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[permissionButton.permissionButtonText]}>Permissões</Text>
        </TouchableOpacity>
        */}
      </View>
    </View>
  )
}

export default function Caregivers() {
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (
    <View    style = {{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
    <MainBox text  = {'Cuidadores'}/>
      {/*<Button title="TEST" onPress={() => navigation.push('ChatTest')}></Button>*/}
      <CaregiversList/>
      <Navbar/>
    </View>
  )
}