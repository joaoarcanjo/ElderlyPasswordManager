import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {Navbar} from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import AddCaregiver from './addCaregiver'
import {CaregiverItem} from './caregiverItem'
import { caregiverListUpdated, setCaregiverListUpdated } from './state'
import { useSessionInfo } from '../../../firebase/authentication/session'
import { CaregiverPermission } from '../../list_credentials/actions/functions'
import { pageTitleCaregiversList } from '../../../assets/constants/constants'


const CaregiversList = React.memo(function CaregiversList() {

  const [caregivers, setCaregivers] = useState<CaregiverPermission[]>([])
  const { userId } = useSessionInfo()

  const refreshValue = async () => {
    try {
      await setCaregiverListUpdated(userId)
    } catch (error) {
      console.log('Error refreshing caregiver list')
    }
  }

  useEffect(() => {
    caregiverListUpdated.subscribe((caregivers) => {
      setCaregivers(caregivers)
    })
  }, [caregiverListUpdated])

  useEffect(() => {refreshValue()}, [])

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
              canWrite={item.canWrite} 
              status={item.caregiver.requestStatus}
            />
          )
        })}
        {caregivers.length < 2 && <AddCaregiver setRefresh={refreshValue} />}
      </View>
    </View>
  )
})

export const Caregivers = React.memo(function Caregivers() {

  return (
    <View style = {{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text  = {pageTitleCaregiversList}/>
      <CaregiversList/>
      <Navbar/>
    </View>
  )
})