import React, { useEffect, useState } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { ElderlyItem, Elderly as ElderlyItemMockup } from './elderlyItem'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Elderly } from '../../../database/types'
import { getAllElderly } from '../../../database'
import { elderlyListUpdated } from './state'
import AddElderly from './addItem'
import { useSessionInfo } from '../../../firebase/authentication/session'

function ElderlyList() {

  const [elderlyList, setElderlyList] = useState<Elderly[]>([])
  const { userId } = useSessionInfo()

  useEffect(() => {
    elderlyListUpdated.subscribe(() => {
        getAllElderly(userId).then(value => {
          setElderlyList(value)
        })
    })
  }, [elderlyListUpdated])

  const refreshValue = () => {
    getAllElderly(userId).then(value => setElderlyList(value))
  }

  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <AddElderly setRefresh={refreshValue}/>
        <ScrollView style={[{flex: 0.85, margin: '3%'}]}>
          {/*<NewElderlyList setRefresh={refreshValue}/> */}
          {elderlyList.map((elderly, index) => 
          
            <ElderlyItem 
              key={index}
              elderlyId={elderly.elderlyId}
              name={elderly.name}
              phone={elderly.phoneNumber}
              email={elderly.email}
              setRefresh={refreshValue} 
              status={elderly.status}/>
          )}
          <ElderlyItemMockup name={'Elisabeth'} phone={'966666666'} email={'elisabeth@gmail.com'} setRefresh={refreshValue} elderlyId={'BO37mI4ZkaQIk2glsufoSVkHgGf2'}/>
        </ScrollView>
      </View>
    </View>
  )
}

export default function ElderlyListScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Idosos'}/>
      {/*<Button title="TEST" onPress={() => navigation.push('ChatTest')}></Button>*/}
      <ElderlyList/>
      <Navbar/>
    </View>
  )
}