import React,{ useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Image } from 'react-native'
import { stylesMainBox } from '../../../styles/main_style'
import { historyStyle, passwordFirstHalf, passwordSecondHalf } from '../styles/styles'
import Algoritm from './algoritm'
import Clipboard from '@react-native-community/clipboard'
import FlashMessage, { showMessage } from 'react-native-flash-message';


export default function Generator({ navigation }: {readonly navigation: any}) {

  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [special, setSpecial] = useState(true);

  const incLength = () => {if(length < 40)setLength(length + 1)}
  const decLength = () => {if(length > 8)setLength(length - 1)}
  const updateUpperCase = () => {if(!verifyPool("upper")) setUppercase(!uppercase)}
  const updateLowerCase = () => {if(!verifyPool("lower")) setLowercase(!lowercase)}
  const updateSpecial = () => {if(!verifyPool("special")) setSpecial(!special)}
  const updateNumbers = () => {if(!verifyPool("numbers")) setNumbers(!numbers)}

  useEffect(() => { generatePasswords() }, [length, uppercase, lowercase, numbers, special])
  
  function verifyPool(currentCase: string): boolean {
    switch(currentCase) {
      case 'upper': 
        return (uppercase && !lowercase && !numbers && !special)
      case 'lower': 
        return (!uppercase && lowercase && !numbers && !special)
      case 'special': 
        return (!lowercase && special && !uppercase && !numbers)
      case 'numbers': 
        return (!lowercase && !special && numbers && !uppercase)
    }
    return (!lowercase && !uppercase && !numbers && !special) 
  }

  function generatePasswords() {
    const password = Algoritm({length: length, strict: true, symbols: special, uppercase: uppercase, lowercase: lowercase, numbers: numbers})
    setPassword(password)
  }

  function saveOnClickBoard() {
    Clipboard.setString(password)
    showMessage({
      message: 'COPIADO',
      type: 'success',
      icon: props => <Image source={require("../../../images/copy.png")} {...props} />,
      color: "black", // text color
    });
  }

  function MainBox() {
    return (
      <View style= { { flex: 0.15, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={stylesMainBox.pageInfoText}>Gerador</Text>
          </View>
      </View>
    )
  }
  
  function HistoryButton() {
    return (
      <View style= { { flex: 0.06, width: '100%', alignItems: 'flex-end' } }>
            <TouchableOpacity style={[{flex: 1,  width: '45%', marginRight: '8%', justifyContent: 'center', alignItems: 'center'}, historyStyle.historyButton]}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontWeight: 'bold', fontSize: 22 }]}>Histórico</Text>
            </TouchableOpacity>
      </View>
    )
  }
  
  function PasswordFirstBox() {
    return (
      <View style= { { flex: 0.24, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, marginTop: '5%', marginHorizontal: '8%', justifyContent: 'center',  alignItems: 'center'}, passwordFirstHalf.container]}>
              
              {/* View onde vai aparecer a password que será gerada */}
              <View style={[{flex: 1,  width: '90%', marginTop: '5%', marginHorizontal: '5%', justifyContent: 'center', alignItems: 'center'}, passwordFirstHalf.passwordGenerated]}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: 22 }]}>{password}</Text>
              </View>
              
              {/* Botões para copiar a password e para gerar uma nova */}
              <View style={{flexDirection: 'row', margin: '5%'}}>
                <TouchableOpacity style={[{flex: 1,  width: '100%', marginRight: '5%', justifyContent: 'center', alignItems: 'center'}, passwordFirstHalf.copyButton]} onPress={() => saveOnClickBoard() }>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Copiar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{flex: 1,  width: '100%', justifyContent: 'center', alignItems: 'center'}, passwordFirstHalf.regenerateButton]} onPress={() => generatePasswords() }>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Regenerar</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View>
    )
  }
  
  function RequirementLength() {
    return (
      <View style={[{flex: 0.20, flexDirection: 'row', width: '90%', justifyContent: 'center',  alignItems: 'center' }, passwordSecondHalf.lengthContainer]}>
        <View style={[{flex: 0.40, width: '100%', justifyContent: 'center',  alignItems: 'center', marginLeft: '5%'}]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[passwordSecondHalf.lengthText]}>Tamanho:</Text>
        </View>
        <View style={[{flex: 0.60, flexDirection: 'row', margin: '5%', justifyContent: 'center',  alignItems: 'center'}]}>
        <TouchableOpacity style={[{flex: 0.30, width: '100%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => decLength()}>
          <Image source={require('../../../images/minus.png')} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        <View style={[{flex: 0.40, width: '100%', marginHorizontal: '5%', alignItems: 'center', backgroundColor: 'red'}, passwordSecondHalf.lengthDisplay]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '5%'}, passwordSecondHalf.numberSelectedText]}>{length}</Text>
        </View>
        <TouchableOpacity style={[{flex: 0.30, width: '100%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => incLength()}>
          <Image source={require('../../../images/plus.png')} style={[{width: '100%', height: 40, margin: '5%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>
        </View>
      </View>
    )
  }
  
  function Requirement({name, value, func}:Readonly<{name: string, value: boolean, func: Function}>) {
    return (
      <View style={[{flex: 0.50, height: '90%', marginHorizontal: '3%', justifyContent: 'center',  alignItems: 'center' }, passwordSecondHalf.lengthContainer]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[passwordSecondHalf.requirementsText]}>{name}</Text>
        {value ? 
        <TouchableOpacity style={[{flex: 0.60, width: '100%', marginTop: '5%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => func()}>
          <Image source={require('../../../images/check.png')} style={[{width: '100%', height: '100%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>:
        <TouchableOpacity style={[{flex: 0.60, width: '100%', marginTop: '5%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => func()}>
          <Image source={require('../../../images/cross.png')} style={[{width: '100%', height: '100%', resizeMode: 'contain'}]}/>
        </TouchableOpacity>}
      </View>
    )
  }
  
  function PasswordSecondBox() {
    return (
      <View style= { { flex: 0.55, flexDirection: 'row', justifyContent: 'space-around'} }>
          <View style={[{flex: 1, marginHorizontal: '4%', justifyContent: 'center',  alignItems: 'center'}, passwordSecondHalf.container]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.10, marginTop: '2%', width: '90%', justifyContent: 'center'}, passwordSecondHalf.requirementsText]}> REQUISITOS:</Text>
              <RequirementLength/>
              <View style={{flex: 0.70, marginHorizontal: '5%', marginBottom: '5%'}}>
                <View style={[{flex: 0.50, width: '90%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}]}>
                  <Requirement name='Maiúsculas' value={uppercase} func={updateUpperCase}/>
                  <Requirement name='Minúsculas' value={lowercase} func={updateLowerCase}/>
                </View>
                <View style={[{flex: 0.50, width: '90%', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center'}]}>
                  <Requirement name='Números' value={numbers} func={updateNumbers}/>
                  <Requirement name='&%/$#"@€' value={special} func={updateSpecial}/>
                </View>
              </View>
          </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
      <MainBox/>
      <HistoryButton/>
      <PasswordFirstBox/>
      <PasswordSecondBox/>
      <FlashMessage position="top" />
    </View>
  )
}