import React,{useEffect, useRef, useState} from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet} from 'react-native'
import {Navbar} from '../../../navigation/actions'
import { styleScroolView, stylesVideo } from '../styles/styles'
import MainBox from '../../../components/MainBox';
import { pageTitleFAQs, passosLabel, perguntasLabel, sugestoesLabel } from '../../../assets/constants/constants';
import { stylesButtons } from '../../../assets/styles/main_style';
import { darkGreenBorder, greyBackgroud } from '../../../assets/styles/colors';
import { useVideoPlayer, VideoView } from 'expo-video';

const jsonData = require('../../../assets/json/faqs.json');

interface FAQs { title: string, description: [string], video: string}

function ScrollItemExample({faq, buttonSelected}: Readonly<{faq: FAQs, buttonSelected: number}>) {

  const [showInfo, setShowInfo] = useState(true)
  const ref = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const player = useVideoPlayer(faq.video)

  const changeInfoState = () => setShowInfo(!showInfo)

  useEffect(() => {setShowInfo(true)}, [buttonSelected])

  useEffect(() => {
    const subscription = player.addListener('playingChange', (isPlaying) => setIsPlaying(isPlaying))
    return () => subscription.remove()
  }, [player])

  const flex = faq.description.length > 0 ? 0.75 : 1
  const numberOfLines = faq.description.length > 0 ? 2 : 5

  return (
    <View style={[{margin: '3%'}, styleScroolView.itemContainer]}>

      <View style={{flex: 0.65, marginHorizontal: '3%', marginVertical: '2%', flexDirection: 'row'}}>
        <View style={{flex: flex, marginRight: '3%' }}>
          <Text numberOfLines={numberOfLines} adjustsFontSizeToFit style={[{ fontSize: 20, margin: '3%', color: 'black', textAlign: 'left' }]}>{faq.title}</Text>
        </View>
        {faq.description.length > 0 ? 
        <View style={{flex: 0.25, marginVertical: '1%'}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}, stylesButtons.whiteButton, stylesButtons.mainConfig]} onPress={changeInfoState}>
            {showInfo ? <Image source={require('../../../assets/images/down-arrow.png')} style={[{width: '70%', height: '70%', margin: '5%', resizeMode: 'contain'}]}/> :
            <Image source={require('../../../assets/images/up-arrow.png')} style={[{width: '70%', height: '70%', margin: '5%', resizeMode: 'contain'}]}/> }
          </TouchableOpacity> 
        </View> : <></>
        }
      </View>
      {!showInfo ?
      <View style={{flex: 1}}>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        {faq.description.map((item: any, index: number) => <Text key={index} numberOfLines={10} adjustsFontSizeToFit style={[{ fontSize: 15, margin: '5%', marginTop: '1%', color: 'black', textAlign: 'left' }]}>{item}</Text>)}
        {faq.video.length > 0 ?

        <>
        <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '4%' }}/>
        <View style={stylesVideo.contentContainer}>
            <VideoView ref={ref} style={stylesVideo.video} player={player} allowsFullscreen allowsPictureInPicture/>
            <View style={stylesVideo.controlsContainer}>
              <TouchableOpacity onPress={() => {
                if (!isPlaying) { player.play() } else { player.pause() };
                setIsPlaying(!isPlaying)
              }} style={[{margin: 10}, stylesButtons.mainSlimConfig, stylesButtons.blueButton]}>
                <Text style={{margin: '5%'}}>{isPlaying ? ' Parar vídeo ⏸️' : 'Reproduzir vídeo ▶️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </> : <></>  
        }
      </View> : <></>
      }
    </View>
  )
}


function FAQsList() {

  const [faqs, setFAQs] = useState(jsonData.questions)
  const [buttonSelected, setButtonSelected] = useState(0)

  const questionColor = buttonSelected === 0 ? stylesButtons.blueButton : stylesButtons.whiteButton
  const stepsColorSelected = buttonSelected === 1 ? stylesButtons.blueButton : stylesButtons.whiteButton
  const suggestionsColorSelected = buttonSelected === 2 ? stylesButtons.blueButton : stylesButtons.whiteButton

  return (
    <View style={{ flex: 0.75, width: '100%', marginTop: '5%', justifyContent: 'space-around'}}>
        <ScrollView>
          {faqs.map((question: FAQs, index: number) => <ScrollItemExample key={index} faq={question} buttonSelected={buttonSelected}/>)}
        </ScrollView>
        <View style={{flexDirection: 'row', backgroundColor: greyBackgroud, borderTopColor: darkGreenBorder, borderTopWidth: 1}}>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: '4%', backgroundColor: greyBackgroud}}>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, questionColor, stylesButtons.mainConfig]} onPress={() => {setFAQs(jsonData.questions); setButtonSelected(0)}}>
              <Text style={{fontSize: 17, color: 'black', marginVertical: '10%', fontWeight: 'bold'}}>{perguntasLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, stepsColorSelected, stylesButtons.mainConfig, stepsColorSelected]} onPress={() => {setFAQs(jsonData.stepByStep); setButtonSelected(1)}}>
              <Text style={{fontSize: 17, color: 'black', marginVertical: '10%', fontWeight: 'bold'}}>{passosLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.33, marginHorizontal: '1%'}, suggestionsColorSelected, stylesButtons.mainConfig]} onPress={() => {setFAQs(jsonData.suggestions); setButtonSelected(2)}}>
              <Text style={{fontSize: 17, color: 'black', marginVertical: '10%', fontWeight: 'bold'}}>{sugestoesLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  )
}

export default function FrequentQuestions() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MainBox text={pageTitleFAQs}/>
      <FAQsList/>
      <Navbar/>
    </View>
  )
}

