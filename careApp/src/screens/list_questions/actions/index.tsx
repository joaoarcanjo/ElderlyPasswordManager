import React,{useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet} from 'react-native'
import {Navbar} from '../../../navigation/actions'
import { styleScroolView } from '../styles/styles'
import MainBox from '../../../components/MainBox';
import { pageTitleFAQs, passosLabel, perguntasLabel, sugestoesLabel, videoLabel } from '../../../assets/constants/constants';
import { stylesButtons } from '../../../assets/styles/main_style';
import { stylesAddCredential } from '../../add_credentials/styles/styles';
import { darkGreenBorder, greyBackgroud } from '../../../assets/styles/colors';
import { Linking } from 'react-native';

const jsonData = require('../../../assets/json/questions.json');

interface Question { title: string, description: [string], video: string }

function ScrollItemExample({question, buttonSelected}: Readonly<{question: Question, buttonSelected: number}>) {

  const [showInfo, setShowInfo] = useState(true);

  const changeInfoState = () => setShowInfo(!showInfo)
  
  useEffect(() => {setShowInfo(true)}, [buttonSelected])

  const flex = question.description.length > 0 ? 0.75 : 1
  const numberOfLines = question.description.length > 0 ? 2 : 5

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginVertical: '2%', flexDirection: 'row'}}>
        <View style={{flex: flex, marginRight: '3%', justifyContent: 'center', alignItems: 'center' }}>
          <Text numberOfLines={numberOfLines} adjustsFontSizeToFit style={[{ fontSize: 20, margin: '3%', color: 'black', textAlign: 'center' }]}>{question.title}</Text>
        </View>
        {question.description.length > 0 ? 
        <View style={{flex: 0.25, marginVertical: '1%'}}>
          {showInfo ? 
            <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}]} onPress={changeInfoState}>
              <Image source={require('../../../assets/images/plus.png')} style={[{width: '70%', height: '70%', margin: '5%', resizeMode: 'contain'}]}/>
            </TouchableOpacity> :
            <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}]} onPress={changeInfoState}>
              <Image source={require('../../../assets/images/minus.png')} style={[{width: '70%', height: '70%', margin: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>} 
        </View> : <></>
        }
      </View>
      {!showInfo ?
      <View style={{flex: 1}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        {question.description.map((item: any, index: number) => <Text key={index} numberOfLines={10} adjustsFontSizeToFit style={[{ fontSize: 15, margin: '5%', marginTop: '1%', color: 'black', textAlign: 'left' }]}>{item}</Text>)}
        {question.video.length > 0 ?

        <>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', margin: '3%'}}>
          <TouchableOpacity style={[{flex: 0.7, marginHorizontal: '1%'}, stylesAddCredential.button, stylesButtons.mainConfig, stylesButtons.orangeButton]} onPress={() => Linking.openURL(question.video)}>
            <Text style={{fontSize: 17, marginVertical: '3%', fontWeight: 'bold'}}>{videoLabel}</Text>
          </TouchableOpacity>
        </View>
        </> : <></>  
        }
      </View> : <></>
      }
    </View>
  )
}

function QuestionsList() {

  const [questions, setQuestions] = useState(jsonData.questions)
  const [buttonSelected, setButtonSelected] = useState(0)

  const questionColor = buttonSelected === 0 ? stylesButtons.blueButton : stylesButtons.greenButton
  const stepsColorSelected = buttonSelected === 1 ? stylesButtons.blueButton : stylesButtons.greenButton
  const suggestionsColorSelected = buttonSelected === 2 ? stylesButtons.blueButton : stylesButtons.greenButton

  return (
    <View style={{ flex: 0.75, width: '100%', marginTop: '5%', justifyContent: 'space-around'}}>
        <ScrollView>
          {questions.map((question: Question, index: number) => <ScrollItemExample key={index} question={question} buttonSelected={buttonSelected}/>)}
        </ScrollView>
        <View style={{flexDirection: 'row', backgroundColor: greyBackgroud, borderTopColor: darkGreenBorder, borderTopWidth: 1}}>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: '4%', backgroundColor: greyBackgroud}}>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, questionColor, stylesButtons.mainConfig]} onPress={() => {setQuestions(jsonData.questions); setButtonSelected(0)}}>
              <Text style={{fontSize: 17, color: 'black', marginVertical: '10%', fontWeight: 'bold'}}>{perguntasLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, stepsColorSelected, stylesButtons.mainConfig, stepsColorSelected]} onPress={() => {setQuestions(jsonData.stepByStep); setButtonSelected(1)}}>
              <Text style={{fontSize: 17, color: 'black', marginVertical: '10%', fontWeight: 'bold'}}>{passosLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, suggestionsColorSelected, stylesButtons.mainConfig]} onPress={() => {setQuestions(jsonData.suggestions); setButtonSelected(2)}}>
              <Text style={{fontSize: 17, color: 'black', marginVertical: '10%', fontWeight: 'bold'}}>{sugestoesLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  )
}

export default function FrequentQuestions() {
  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox text={pageTitleFAQs}/>
      <QuestionsList/>
      <Navbar/>
    </View>
  )
}