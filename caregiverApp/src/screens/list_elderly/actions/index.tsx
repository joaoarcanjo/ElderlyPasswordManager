import React from 'react'
import { View, ScrollView, Button } from 'react-native'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import CaregiverItem from './elderlyItem'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import NewElderlyList from './newElderly'

function ElderlyList() {

  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <ScrollView style={[{margin: '3%'}]}>
          <NewElderlyList/>
          <CaregiverItem name={'Elisabeth'}/>
        </ScrollView>
      </View>
    </View>
  )
}

export default function Elderly() {
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