import React, { useEffect, useState } from 'react'
import { View, ScrollView, Button } from 'react-native'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { ElderlyItem, ElderlyItemMockup } from './elderlyItem'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Elderly } from '../../../database/types'
import { getAllElderly } from '../../../database'
import { elderlyListUpdated } from './state'

function ElderlyList() {

  const [elderlyList, setElderlyList] = useState<Elderly[]>([])

  useEffect(() => {
    const subscription = elderlyListUpdated.subscribe(() => {
        getAllElderly().then(value => setElderlyList(value))
    })
    return () => subscription.unsubscribe()
}, [elderlyListUpdated])

  const refreshValue = () => {
    getAllElderly().then(value => setElderlyList(value))
  }

  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <ScrollView style={[{margin: '3%'}]}>
          {/*<NewElderlyList setRefresh={refreshValue}/> */}
          {elderlyList.map((elderly, index) => 
            <ElderlyItem 
              key={index}
              name={elderly.name}
              phone={elderly.phoneNumber}
              email={elderly.email}
              setRefresh={refreshValue} 
              accepted={elderly.accepted}/>
          )}
          <ElderlyItemMockup name={'Elisabeth'}/>
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