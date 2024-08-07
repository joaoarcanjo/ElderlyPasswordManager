import React,{useEffect, useRef, useState} from 'react'
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform} from 'react-native'
import {Navbar} from '../../../navigation/actions'
import { styleScroolView, styleSectionButton, stylesVideo } from '../styles/styles'
import MainBox from '../../../components/MainBox';
import { pageTitleQuestions, passosLabel, perguntasLabel, seeLessLabel, seeMoreLabel, sugestoesLabel } from '../../../assets/constants/constants';
import { stylesButtons } from '../../../assets/styles/main_style';
import { arrowButtonTextColor, arrowColor, darkGrey, numericColor, numericColor2, optionsBackground, optionsBorder } from '../../../assets/styles/colors';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { questionsTitleTextSize, questionsDescriptionTextSize } from '../../../assets/styles/text';
import { options } from '../../credential_interface/styles/styles';

const jsonData = require('../../../assets/json/questions.json');

interface Questions { icon: string, title: string, description: [string], video: string }

function ScrollItemExampleAndroid({question, buttonSelected}: Readonly<{question: Questions, buttonSelected: number}>) {

  const [showInfo, setShowInfo] = useState(true)

  const changeInfoState = () => setShowInfo(!showInfo)

  useEffect(() => {setShowInfo(true)}, [buttonSelected])

  const flex = question.description.length > 0 ? 0.75 : 1
  const numberOfLines = question.description.length > 0 ? 3 : 10

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>
      <View style={{flex: 0.65, marginHorizontal: '3%', marginVertical: '2%', flexDirection: 'row'}}>
        <View style={{flex: flex, marginRight: '3%' }}>
          <Text numberOfLines={numberOfLines} adjustsFontSizeToFit style={[{ fontSize: questionsTitleTextSize, margin: '3%', color: darkGrey, textAlign: 'left' }]}>{question.title}</Text>
        </View>
        {question.description.length > 0 ? 
        <View style={{flex: 0.25, marginVertical: '1%'}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}, stylesButtons.moreInfoButton, stylesButtons.mainConfig]} onPress={changeInfoState}>
            {showInfo ? 
            <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
              <FontAwesome name="chevron-down" size={34} color={arrowColor} />
              <Text style={{color: arrowButtonTextColor}}>{seeMoreLabel}</Text>
            </View>
            :
            <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
              <FontAwesome name="chevron-up" size={34} color={arrowColor} />
              <Text>{seeLessLabel}</Text>
            </View>}
          </TouchableOpacity> 
        </View> : <></>
        }
      </View>
      {!showInfo ?
      <View style={{flex: 1}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        {question.description.map((item: any, index: number) => <Text key={index} numberOfLines={10} adjustsFontSizeToFit style={[{ fontSize: questionsDescriptionTextSize, margin: '5%', marginTop: '1%', color: darkGrey, textAlign: 'left' }]}>{item}</Text>)}
        {question.video.length > 0 ?

        <>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        <View style={stylesVideo.contentContainer}>
            
          </View>
        </> : <></>  
        }
      </View> : <></>
      }
    </View>
  )
}

function ScrollItemExampleIOS({question, buttonSelected}: Readonly<{index: number, question: Questions, buttonSelected: number}>) {

  const expoVideo = require('expo-video');
  const useVideoPlayer = expoVideo.useVideoPlayer;
  const VideoView = expoVideo.VideoView;

  const [showInfo, setShowInfo] = useState(true)
  const ref = useRef(null)
  
  const player = useVideoPlayer(question.video)

  const changeInfoState = () => setShowInfo(!showInfo)

  useEffect(() => {setShowInfo(true)}, [buttonSelected])

  const flex = question.description.length > 0 ? 0.78 : 1
  const numberOfLines = question.description.length > 0 ? 3 : 10

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>
      <View style={{flex: 0.75, marginHorizontal: '2%', marginVertical: '2%', flexDirection: 'row'}}>
        <View style={{flex: flex, flexDirection: 'row', marginRight: '5%' }}>
          <MaterialCommunityIcons name={question.icon} size={30} color={numericColor} />
          <Text numberOfLines={numberOfLines} adjustsFontSizeToFit style={[{ fontSize: questionsTitleTextSize, color: darkGrey, marginRight: '5%', marginLeft: '1%' }]}>{question.title}</Text>
        </View>
        {question.description.length > 0 ? 
        <View style={{flex: 0.25, marginVertical: '1%'}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}, stylesButtons.moreInfoButton, stylesButtons.mainConfig]} onPress={changeInfoState}>
            {showInfo ? 
            <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
              <FontAwesome name="chevron-down" size={34} color={arrowColor} />
              <Text style={{color: arrowButtonTextColor}}>{seeMoreLabel}</Text>
            </View>
            :
            <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
              <FontAwesome name="chevron-up" size={34} color={arrowColor} />
              <Text>{seeLessLabel}</Text>
            </View>}
          </TouchableOpacity> 
        </View> : <></>
        }
      </View>
      {!showInfo ?
      <View style={{flex: 1}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        {question.description.map((item: any, index: number) => 
        <View key={index} style={{flexDirection: 'row', marginRight: '5%', marginLeft: '2%', marginVertical: '4%'}}>
          <MaterialCommunityIcons name={item.icon} size={30} color={numericColor2} />
          <Text key={index} numberOfLines={10} adjustsFontSizeToFit style={[{ flex: 1, marginLeft: '2%', textAlign: 'justify', fontSize: questionsDescriptionTextSize, color: darkGrey }]}>{item.response}</Text>
        </View>)}
        {question.video.length > 0 ?
        <>
          <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
          <View style={stylesVideo.contentContainer}>
              <VideoView ref={ref} style={stylesVideo.video} player={player} allowsFullscreen allowsPictureInPicture/>
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

  const questionColor = buttonSelected === 0 ? styleSectionButton.sectionButtonSelected : styleSectionButton.sectionButtonNotSelected
  const stepsColorSelected = buttonSelected === 1 ? styleSectionButton.sectionButtonSelected : styleSectionButton.sectionButtonNotSelected
  const suggestionsColorSelected = buttonSelected === 2 ? styleSectionButton.sectionButtonSelected : styleSectionButton.sectionButtonNotSelected

  return (
    <View style={{ flex: 0.75, width: '100%', marginTop: '5%', justifyContent: 'space-around'}}>
        <ScrollView>
          {questions.map((question: Questions, index: number) => {
            if(Platform.OS === 'ios') {
              return <ScrollItemExampleIOS key={index} index={index+1} question={question} buttonSelected={buttonSelected}/>
            }
            return <ScrollItemExampleAndroid key={index} question={question} buttonSelected={buttonSelected}/>
          })}
        </ScrollView>
        <View style={{flexDirection: 'row', backgroundColor: optionsBackground, borderTopColor: optionsBorder, borderTopWidth: 1}}>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: '4%', backgroundColor: optionsBackground}}>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, questionColor, stylesButtons.mainConfig]} onPress={() => {setQuestions(jsonData.questions); setButtonSelected(0)}}>
              <Text style={[{color: darkGrey, marginVertical: '10%', fontWeight: 'bold'}, options.doubtOptionButtonText]}>{perguntasLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, stepsColorSelected, stylesButtons.mainConfig]} onPress={() => {setQuestions(jsonData.stepByStep); setButtonSelected(1)}}>
              <Text style={[{color: darkGrey, marginVertical: '10%', fontWeight: 'bold'}, options.doubtOptionButtonText]}>{passosLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, suggestionsColorSelected, stylesButtons.mainConfig]} onPress={() => {setQuestions(jsonData.suggestions); setButtonSelected(2)}}>
            <Text style={[{color: darkGrey, marginVertical: '10%', fontWeight: 'bold'}, options.doubtOptionButtonText]}>{sugestoesLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  )
}

export default function FrequentQuestions() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MainBox text={pageTitleQuestions}/>
      <QuestionsList/>
      <Navbar/>
    </View>
  )
}
