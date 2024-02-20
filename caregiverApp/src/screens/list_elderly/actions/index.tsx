import React, { useEffect, useState } from 'react'
import { View, ScrollView, Button } from 'react-native'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import { ElderlyItem, ElderlyItemMockup } from './elderlyItem'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import NewElderlyList from './newElderly'
import { Elderly } from '../../../database/types'
import { getAllElderly } from '../../../database'
import { currentSessionSubject } from '../../../e2e/session/state'
import { Observable } from 'rxjs/internal/Observable'

function ElderlyList() {

  const [elderlyList, setElderlyList] = useState<Elderly[]>([])
  const [refresh, setRefresh] = useState(false)

  const refreshValue = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    getAllElderly().then(value => setElderlyList(value))
  }, [refresh])

  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <ScrollView style={[{margin: '3%'}]}>
          <NewElderlyList setRefresh={refreshValue}/>
          {elderlyList.map((elderly, index) => <ElderlyItem key={index} name={elderly.name} phone={elderly.phoneNumber} email={elderly.email} setRefresh={refreshValue}/>)}
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
      <Button title="TEST" onPress={() => navigation.push('ChatTest')}></Button>
      <ElderlyList/>
      <Navbar/>
    </View>
  )
}

function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
      const subscription = observable.subscribe((newValue) => {
          setValue(newValue)
      })
      return () => subscription.unsubscribe()
  }, [observable])

  return value
}