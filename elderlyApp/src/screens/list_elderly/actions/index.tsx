import React, { useEffect, useState } from 'react'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import Navbar from '../../../navigation/actions'
import MainBox from '../../../components/MainBox'
import CaregiverItem from './elderly_item'
import { sessionListSubject } from '../../../e2e/session/state'
import { Observable } from 'rxjs'
import { elderlyStyle, newElderlyOptions } from '../styles/styles'
import { stylesButtons } from '../../../assets/styles/main_style'

function NewElderly() {
  const sessionList = useObservable(sessionListSubject, [])
  //TODO: VERIFICAR SE A NOVA CONEXÃO É DE UM IDOSO COM QUEM NÃO HÁ QUALQUER RELAÇÃO
  //Se aceitar, vai enviar para o idoso os seus dados.
  //Vai receber os dados do idoso e vai armazenar localmente.


  if (sessionList.length === 0) return 
  else {
    return (
      <View style={[{flex: 0.5}, elderlyStyle.newElderlyContainer]}>
        <View style={{marginLeft: '10%'}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 20, marginTop: '5%' }]}>Elisabeth</Text>
        </View>
        <View style={{flex: 0.45, margin: '0%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, newElderlyOptions.acceptButton, stylesButtons.mainConfig]} onPress={() => {}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newElderlyOptions.buttonText]}>Aceitar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, newElderlyOptions.rejectButton, stylesButtons.mainConfig]} onPress={() => {}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newElderlyOptions.buttonText]}>Recusar</Text>
          </TouchableOpacity>
        </View>
    </View>
    )
  }
}

function ElderlyList() {
  return (
    <View style={{ flex: 0.85, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
      <View style={[{ flex: 1, marginHorizontal: '4%', marginBottom: '3%', justifyContent: 'space-around'}]}>
        <ScrollView style={[{margin: '3%'}]}>
          <NewElderly/>
          <CaregiverItem/>
          <CaregiverItem/>
          <CaregiverItem/>
        </ScrollView>
      </View>
    </View>
  )
}

//TODO: construir um main componente para ter receber apenas os components childs de cada page
export default function Elderly() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}> 
      <MainBox text={'Idosos'}/>
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