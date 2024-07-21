import React,{ useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Image } from 'react-native'
import { stylesButtons } from '../../../assets/styles/main_style'
import { historyStyle, passwordFirstHalf, passwordSecondHalf } from '../styles/styles'
import {Navbar} from '../../../navigation/actions'
import { savePasswordGenerated } from '../../../database/passwords'
import MainBox from '../../../components/MainBox'
import { useSessionInfo } from '../../../context/session'
import { copyLabel, emptyValue, historyLabel, lengthLabel, lowerLabel, numbersLabel, pagePasswordHistory, pageTitleGenerator, passwordDefaultLengthGenerator, regenerateLabel, requirementLabel, specialLabel, timeoutToSavePassword, upperLabel } from '../../../assets/constants/constants'
import { Requirements } from '../../../components/passwordGenerator/constants'
import Algorithm from '../../../algorithms/newPassword/newPass'
import { FlashMessage, copyPasswordDescription } from '../../../assets/constants/messages'
import { historyTextColor } from '../../../assets/styles/colors'
import { options } from '../../credential_interface/styles/styles'
import { copyValue } from '../../../notifications/UserMessages'
import { Requirement } from '../../../components/passwordGenerator/Requirement'
import { buttonNormalTextSize, generatorPasswordGeneratedLabelTextSize } from '../../../assets/styles/text'

const minusImage = "../../../assets/images/minus.png"
const plusImage = "../../../assets/images/plus.png"

export default function Generator({ navigation }: {readonly navigation: any}) {

  const [passGenerated, setPassGenerated] = useState(emptyValue)
  const [password, setPassword] = useState(emptyValue)
  const [length, setLength] = useState(passwordDefaultLengthGenerator)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [special, setSpecial] = useState(true)
  const { localDBKey, userId } = useSessionInfo()

  const incLength = () => {if(length < 40)setLength(length + 1)}
  const decLength = () => {if(length > 8)setLength(length - 1)}
  const updateUpperCase = () => {if(!verifyPool(Requirements.Upper)) setUppercase(!uppercase)}
  const updateLowerCase = () => {if(!verifyPool(Requirements.Lower)) setLowercase(!lowercase)}
  const updateSpecial = () => {if(!verifyPool(Requirements.Special)) setSpecial(!special)}
  const updateNumbers = () => {if(!verifyPool(Requirements.Numbers)) setNumbers(!numbers)}

  //UseEffects: ---
  
  useEffect(() => { 
    generatePassword()
   }, [length, uppercase, lowercase, numbers, special])

  useEffect(() => {
    const timer = setTimeout(() => {
      if(passGenerated != password) {
        saveNewPassword()
      }
    }, timeoutToSavePassword);
    return () => clearTimeout(timer);
  }, [password, passGenerated]);


  //Auxiliar functions: ---
  function verifyPool(currentCase: string): boolean {
    switch(currentCase) {
      case Requirements.Upper: 
        return (uppercase && !lowercase && !numbers && !special)
      case Requirements.Lower: 
        return (!uppercase && lowercase && !numbers && !special)
      case Requirements.Special: 
        return (!lowercase && special && !uppercase && !numbers)
      case Requirements.Numbers: 
        return (!lowercase && !special && numbers && !uppercase)
    }
    return (!lowercase && !uppercase && !numbers && !special) 
  }

  async function saveNewPassword() {
    if(passGenerated != password) {
      // You can use the 'result' object to get information about the password strength
      setPassword(passGenerated)
      savePasswordGenerated(passGenerated, userId, localDBKey)
    }
  }

  function generatePassword() {
    const password = Algorithm({length: length, strict: true, symbols: special, uppercase: uppercase, lowercase: lowercase, numbers: numbers})
    setPassGenerated(password)
  }

  /* Quando se clica em guardar, vai copiar a mesma, e guardar em histórico a nova password
     Basicamente vai fazer o que faria ao fim de timestamp, mas de forma instântanea.
  */
  function saveOnClickBoard() {
    saveNewPassword()
    copyValue(password, FlashMessage.passwordCopied, copyPasswordDescription)
  }

  //Components: ---

  function HistoryButton() {

    const HistoryPressed = () => {
      saveNewPassword()
      navigation.push(pagePasswordHistory)
    }

    return (
      <View style={{flex: 0.10}}>
        <TouchableOpacity style={[{flex: 1, marginVertical: '3%', width: '90%'}, historyStyle.historyButton, stylesButtons.mainConfig]} onPress={() => HistoryPressed()}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{ marginHorizontal: '25%', fontWeight: 'bold', fontSize: buttonNormalTextSize, color: historyTextColor }]}>{historyLabel}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function RequirementLength() {
    return (
      <View style={[{flex: 0.20, flexDirection: 'row', width: '90%', justifyContent: 'center',  alignItems: 'center' }, passwordSecondHalf.lengthContainer]}>
        <View style={[{flex: 0.40, width: '100%', justifyContent: 'center',  alignItems: 'center', marginLeft: '5%'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[passwordSecondHalf.lengthText]}>{lengthLabel}</Text>
        </View>
        <View style={[{flex: 0.60, flexDirection: 'row', margin: '5%', justifyContent: 'center',  alignItems: 'center'}]}>
        <TouchableOpacity style={[{flex: 0.30}]} onPress={() => decLength()}>
          <Image source={require(minusImage)} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        <View style={[{flex: 0.40, marginHorizontal: '5%', alignItems: 'center'}, passwordSecondHalf.lengthDisplay]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '1%'}, passwordSecondHalf.numberSelectedText]}>{length}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.30}]} onPress={() => incLength()}>
          <Image source={require(plusImage)} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MainBox text={pageTitleGenerator}/>
      <View style= { { flex: 0.24, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, marginTop: '2%', marginHorizontal: '8%', justifyContent: 'center',  alignItems: 'center'}, passwordFirstHalf.container]}>
              
              {/* View onde vai aparecer a password que será gerada */}
              <View style={[{flex: 1,  width: '90%', marginTop: '5%',marginBottom: '1%', marginHorizontal: '5%', justifyContent: 'center', alignItems: 'center'}, passwordFirstHalf.passwordGenerated]}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: generatorPasswordGeneratedLabelTextSize }]}>{passGenerated}</Text>
              </View>
              {/* Botões para copiar a password e para gerar uma nova */}
              <View style={{flexDirection: 'row', margin: '3%', marginBottom: '5%'}}>
                <TouchableOpacity style={[{flex: 0.5, marginRight: '2%'}, passwordFirstHalf.copyButton, stylesButtons.mainConfig]} onPress={() => saveOnClickBoard() }>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ margin: '5%' }, options.copyButtonText]}>{copyLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{flex: 0.5, marginLeft: '2%'}, passwordFirstHalf.regenerateButton, stylesButtons.mainConfig]} onPress={() => generatePassword() }>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={[{ margin: '5%', textAlign: 'center' }, options.generateLabelText]}>{regenerateLabel}</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View>
      <View style= { { flex: 0.50, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, marginHorizontal: '4%', justifyContent: 'center',  alignItems: 'center'}, passwordSecondHalf.container]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '2%', width: '90%', justifyContent: 'center'}, passwordSecondHalf.requirementsText]}>{requirementLabel}</Text>
              <RequirementLength/>
              <View style={{flex: 0.70, marginHorizontal: '5%', marginVertical: '5%'}}>
                <View style={[{flex: 0.50, width: '100%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}]}>
                  <Requirement name={upperLabel} value={uppercase} func={updateUpperCase}/>
                  <Requirement name={lowerLabel} value={lowercase} func={updateLowerCase}/>
                </View>
                <View style={[{flex: 0.50, width: '100%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}]}>
                  <Requirement name={numbersLabel} value={numbers} func={updateNumbers}/>
                  <Requirement name={specialLabel} value={special} func={updateSpecial}/>
                </View>
              </View>
          </View>
      </View>
      <HistoryButton/>
      <Navbar/>
    </View>
  )
}