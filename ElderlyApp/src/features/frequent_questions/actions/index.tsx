import React,{useState} from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet} from 'react-native'
import { stylesMainBox } from '../../../assets/styles/main_style'
import Navbar from '../../../navigation/actions'
import { styleScroolView } from '../styles/styles'

function MainBox() {

  return (
    <View style= { { flex: 0.15, flexDirection: 'row', justifyContent: 'space-around'} }>
        <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesMainBox.pageInfoText]}>FAQs</Text>
        </View>
    </View>
  )
}

function ScrollItemExample() {

  const [showInfo, setShowInfo] = useState(true);

  const changeInfoState = () => setShowInfo(!showInfo)

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginVertical: '2%', flexDirection: 'row'}}>

        <View style={{flex: 0.65, marginRight: '3%', justifyContent: 'center', alignItems: 'center' }}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: 25, margin: '3%', color: 'black' }]}>É possível ter mais que um cuidador?</Text>
        </View>

        <View style={{flex: 0.35}}>
          {showInfo ? 
            <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => changeInfoState()}>
              <Image source={require('../../../assets/images/plus.png')} style={[{width: '70%', height: '70%', marginRight: '5%', resizeMode: 'contain'}]}/>
            </TouchableOpacity> :
            <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => changeInfoState()}>
              <Image source={require('../../../assets/images/minus.png')} style={[{width: '70%', height: '70%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>}  
        </View>
      </View>
      {!showInfo ?
        <View>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        <Text numberOfLines={10} adjustsFontSizeToFit style={[{ fontSize: 17, margin: '5%', color: 'black' }]}>
          É necessário x, y e z. É necessário x, y e z.
        </Text>
      </View> : <></>
      }
    </View>
  )
}


function QuestionsLists() {
  return (
    <View style={{ flex: 0.75, flexDirection: 'row', justifyContent: 'space-around'}}>
        <ScrollView style={[{margin: '3%'}]}>
          <ScrollItemExample/>
          <ScrollItemExample/>
          <ScrollItemExample/>
          <ScrollItemExample/>
          <ScrollItemExample/>
          <ScrollItemExample/>
          <ScrollItemExample/>
        </ScrollView>
    </View>
  )
}

export default function FrequentQuestions({ navigation }: {readonly navigation: any}) {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <QuestionsLists/>
      <Navbar navigation={navigation}/>
    </View>
  )
}