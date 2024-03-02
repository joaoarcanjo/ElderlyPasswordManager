import React, { useState } from "react"
import { View, Text, Image, TouchableOpacity, Linking } from "react-native"
import { elderlyOptions, elderlyStyle, newElderlyOptions, elderlyContactInfo, decouplingOption } from "../styles/styles"
import { stylesButtons } from "../../../assets/styles/main_style";
import { acceptElderly, decouplingElderly, refuseElderly } from "./functions";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { useNavigation } from "@react-navigation/native";
import { getKeychainValueFor } from "../../../keychain";
import { elderlySSSKey } from "../../../keychain/constants";
import { YesOrNoModal } from "../../../components/Modal";
import { useSessionInfo } from "../../../firebase/authentication/session";

const caregiverImage = '../../../assets/images/elderly.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'

export function ElderlyItem({elderlyId, name, phone, email, setRefresh, accepted}: Readonly<{elderlyId: string, name: string, phone: string, email: string, setRefresh: Function, accepted: number}>) {
  return (
    accepted == 1 ? 
      <Elderly name={name} phone={phone} email={email} elderlyId={elderlyId} setRefresh={setRefresh}/>
    : 
      <ElderlyPending name={name} email={email} setRefresh={setRefresh}/>
  )
}

export function ElderlyPending({ name, email, setRefresh }: Readonly<{name: string, email: string, setRefresh: Function}>) {

  const { userId, userEmail, userName, userPhone } = useSessionInfo()
  
  const accept = () => { acceptElderly(userId, email, userName, userEmail, userPhone).then(() => setRefresh()) }
  const refuse = () => { refuseElderly(email).then(() => setRefresh()) } 

  return (
    <View style={[{flex: 1}, elderlyStyle.newElderlyContainer]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }}>
        <View style={{ flex: 1 }}>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 18 }}>{`O idoso ${name} com o email ${email} enviou-lhe um pedido!`}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '3%' }}/>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, newElderlyOptions.acceptButton, stylesButtons.mainConfig]} onPress={accept}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newElderlyOptions.buttonText]}>Aceitar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, newElderlyOptions.rejectButton, stylesButtons.mainConfig]} onPress={refuse}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '5%' }, newElderlyOptions.buttonText]}>Recusar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View> 
  )
}

export function Elderly({ elderlyId, name, phone, email, setRefresh }: Readonly<{elderlyId: string, name: string, phone: string, email: string, setRefresh: Function}>) {

  const [showInfo, setShowInfo] = useState(true)
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [modalVisible, setModalVisible] = useState(false)

  const deleteElderly = () => {
    decouplingElderly(email).then(() => setRefresh())
  }

  const changeInfoState = () => setShowInfo(!showInfo)

  const navigateToElderlyCredentials = async () => {
    const userShared = await getKeychainValueFor(elderlySSSKey(elderlyId))
    navigation.navigate('ElderlyCredentials', { elderlyEmail: email, elderlyName: name, elderlyId: elderlyId, userShared: userShared })
  }

  return (
    <View style={[{flex: 1}, elderlyStyle.container]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }}>
        <Image source={require(caregiverImage)} style={{ width: 80, height: 80, borderRadius: 40, marginRight: 15 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{name}</Text>
          <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: '3%' }} />
          <View style={{flex: 1, marginVertical: '3%', marginRight: '5%', flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.65, marginHorizontal: '1%', marginVertical: '1%'}, elderlyOptions.openCredentials, stylesButtons.mainConfig]} onPress={navigateToElderlyCredentials}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '6%' }]}>Credenciais</Text>
            </TouchableOpacity>
            <View style={{flex: 0.30, marginLeft: '8%'}}>
              {showInfo ? 
                <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => changeInfoState()}>
                  <Image source={require('../../../assets/images/plus.png')} style={[{width: '70%', height: '70%', marginRight: '5%', resizeMode: 'contain'}]}/>
                </TouchableOpacity> :
                <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}]} onPress={() => changeInfoState()}>
                  <Image source={require('../../../assets/images/minus.png')} style={[{width: '70%', height: '70%', marginRight: '5%', resizeMode: 'contain'}]}/>
              </TouchableOpacity>}  
            </View>
          </View>
        </View>
      </View>

      {!showInfo ?
      <View>
        <View style={{ height: 2, backgroundColor: '#ccc', margin: '4%', marginTop: '0%' }} />
        <View style={{flex: 0.65, marginBottom:'3%'}}>
          <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, elderlyContactInfo.accountInfo, stylesButtons.mainConfig]} onPress={() => Linking.openURL(`tel:${phone}`) }>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%', marginVertical: '2%'}, elderlyContactInfo.accountInfoText]}>{phone}</Text>
            <Image source={require(telephoneImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
          <TouchableOpacity style={[{ flex: 0.50, marginTop:'2%', flexDirection: 'row', marginHorizontal: '4%'}, elderlyContactInfo.accountInfo, stylesButtons.mainConfig]}  onPress={() => Linking.openURL(`mailto:${email}`)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.8, marginLeft: '7%', marginVertical: '2%'}, elderlyContactInfo.accountInfoText]}>{email}</Text>
            <Image source={require(emailImage)} style={[{flex: 0.2, height: '80%', marginRight: '5%', resizeMode: 'contain'}]}/>
          </TouchableOpacity>
        </View>
        <View>
          <View style={{ height: 2, backgroundColor: '#ccc', margin: '4%', marginTop: '5%' }} />
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, decouplingOption.button, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '2%' }, decouplingOption.buttonText]}>Desvincular</Text>
          </TouchableOpacity>
        </View>
      </View> : <></>}
      <YesOrNoModal question={'Concluir desvinculação?'} yesFunction={deleteElderly} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
    </View>
  )
}