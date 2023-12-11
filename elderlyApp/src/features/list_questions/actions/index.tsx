import React,{useState} from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet} from 'react-native'
import Navbar from '../../../navigation/actions'
import { styleScroolView } from '../styles/styles'
import MainBox from '../../../components/MainBox';

const jsonData = require('./questions.json');

interface Question { response: any, question: any }

function ScrollItemExample({question}: Readonly<{question: Question}>) {

  const [showInfo, setShowInfo] = useState(true);

  const changeInfoState = () => setShowInfo(!showInfo)

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginVertical: '2%', flexDirection: 'row'}}>

        <View style={{flex: 0.75, marginRight: '3%', justifyContent: 'center', alignItems: 'center' }}>
          <Text numberOfLines={2} style={[{ fontSize: 17, margin: '3%', color: 'black' }]}>{question.question}</Text>
        </View>

        <View style={{flex: 0.25}}>
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
        <Text numberOfLines={10} adjustsFontSizeToFit style={[{ fontSize: 15, margin: '5%', color: 'black' }]}>
          {question.response}
        </Text>
      </View> : <></>
      }
    </View>
  )
}

function QuestionsList() {
  return (
    <View style={{ flex: 0.75, flexDirection: 'row', marginTop: '5%', justifyContent: 'space-around'}}>
        <ScrollView>
          {jsonData.questions.map((question: Question) => <ScrollItemExample key={question.question} question={question}/>)}
        </ScrollView>
    </View>
  )
}

export default function FrequentQuestions() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={'FQAs'}/>
      <QuestionsList/>
      <Navbar/>
    </View>
  )
}