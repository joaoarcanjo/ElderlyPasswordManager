import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import AddCaregiver from './addCaregiver'
import {CaregiverItem} from './caregiverItem'
import { Caregiver, CaregiverRequestStatus } from '../../../database/types'
import { caregiverListUpdated } from './state'
import { getCaregiversArray } from '../../../firebase/firestore/functionalities'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { deleteCaregiver, getCaregivers } from '../../../database/caregivers'
import { executeKeyExchange } from '../../../algorithms/sss/sssOperations'

interface CaregiverPermission {
  canRead: boolean,
  canWrite: boolean,
  caregiver: Caregiver
}

async function getCaregiversPermissions(userId: string, setUserFireKey: Function): Promise<CaregiverPermission[]> {
  console.log('===> getCaregiversPermissionsCalled')
  const caregivers = await getCaregivers(userId)
  const readCaregivers = await getCaregiversArray(userId, 'readCaregivers')
  const writeCaregivers = await getCaregiversArray(userId, 'writeCaregivers')

  let caregiversPermissions: CaregiverPermission[] = []
  caregivers.forEach(async (caregiver) => {
    if(caregiver.requestStatus === CaregiverRequestStatus.ACCEPTED || caregiver.requestStatus === CaregiverRequestStatus.RECEIVED) {
      caregiversPermissions.push({
        canRead: readCaregivers.includes(caregiver.caregiverId),
        canWrite: writeCaregivers.includes(caregiver.caregiverId),
        caregiver
      })
    } else if (caregiver.requestStatus === CaregiverRequestStatus.DECOUPLING) {
      await deleteCaregiver(userId, caregiver.email)
      try {
        const share = await executeKeyExchange(userId)
        setUserFireKey(share)
      } catch (error) {
        console.log('Error deleting caregiver')
      }
    }
  })
  return caregiversPermissions
}

function CaregiversList() {

  const [caregivers, setCaregivers] = useState<CaregiverPermission[]>([])
  const { userId, setUserFireKey } = useSessionInfo()

  const refreshValue = async () => {
    console.log('===> CaregiversList refreshed.')
    const caregiversPermissions = await getCaregiversPermissions(userId, setUserFireKey)
    setCaregivers(caregiversPermissions)
  }

  useEffect(() => {
    caregiverListUpdated.subscribe(refreshValue)
      //return () => subscription.unsubscribe()
  }, [caregiverListUpdated])

  return (
    <View style = {{ flex: 0.85, flexDirection: 'row', marginTop: '1%', justifyContent: 'space-around'}}>
    <View style = {[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        {caregivers.map((item, index) => {
          return (
            <CaregiverItem 
              number={index+1} 
              caregiverId={item.caregiver.caregiverId} 
              key={item.caregiver.caregiverId} 
              name={item.caregiver.name} 
              phone={item.caregiver.phoneNumber} 
              email={item.caregiver.email} 
              setRefresh={refreshValue} 
              canWrite={false} 
              status={item.caregiver.requestStatus}
            />
          )
        })}
        {caregivers.length === 0 && <AddCaregiver number={1} setRefresh={refreshValue} />}
        {caregivers.length < 2 && <AddCaregiver number={2} setRefresh={refreshValue} />}
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