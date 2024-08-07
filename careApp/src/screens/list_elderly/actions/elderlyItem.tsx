import React, { useState } from "react"
import { View, Text, Image, TouchableOpacity, Linking, Alert } from "react-native"
import { elderlyStyle, elderlyContactInfo, decouplingOption, newElderlyContainer } from "../styles/styles"
import { stylesButtons } from "../../../assets/styles/main_style";
import { acceptElderly, cancelWaitingElderly, decouplingElderly, refuseElderly } from "./functions";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { useNavigation } from "@react-navigation/native";
import { YesOrNoModal } from "../../../components/Modal";
import { useSessionInfo } from "../../../context/session";
import { ElderlyRequestStatus } from "../../../database/types";
import { getKeychainValueFor } from "../../../keychain";
import { elderlySSSKey } from "../../../keychain/constants";
import { acceptLabel, cancelLabel, closeLabel, credentialsLabel, emptyValue, filtersLabel, optionsLabel, pageElderlyCredentials, refuseLabel, seeLessLabel, seeMoreLabel, unlinkLabel } from "../../../assets/constants/constants";
import { FontAwesome } from "@expo/vector-icons";
import { arrowButtonTextColor, arrowColor, dividerLineColorDark } from "../../../assets/styles/colors";
import { buttonNormalTextSize, elderlyDescriptionTextSize, elderlyTitleTextSize } from "../../../assets/styles/text";
import { options } from "../../credential_interface/styles/styles";

const caregiverImage = '../../../assets/images/elderly.png'
const telephoneImage = '../../../assets/images/telephone.png'
const emailImage = '../../../assets/images/email.png'

export function ElderlyItem({elderlyId, name, phone, email, setRefresh, status}: Readonly<{elderlyId: string, name: string, phone: string, email: string, setRefresh: Function, status: number}>) {
  if(status == ElderlyRequestStatus.RECEIVED) {
    return <ElderlyToBeAccepted name={name} email={email} setRefresh={setRefresh}/>
  } else if (status == ElderlyRequestStatus.ACCEPTED) {
    return <Elderly name={name} phone={phone} email={email} elderlyId={elderlyId} setRefresh={setRefresh}/>
  } else if (status == ElderlyRequestStatus.WAITING) {
      return <ElderlyWaiting elderlyEmail={email} setRefresh={setRefresh}/>
  } else {
    //Nada por agora.
  }
}

export function ElderlyToBeAccepted({ name, email, setRefresh }: Readonly<{name: string, email: string, setRefresh: Function}>) {

  const { userId, userEmail, userName, userPhone } = useSessionInfo()
  
  const accept = () => { acceptElderly(userId, email, userName, userEmail, userPhone).then(() => setRefresh()) }
  const refuse = () => { refuseElderly(userId, email).then(() => setRefresh()) } 

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: '4%'}}>
       <View style={[{ flexDirection: 'row', alignItems: 'center' }, elderlyStyle.newElderlyContainer]}>
        <View style={{ flex: 1, marginTop: '1%' }}>
          <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: elderlyTitleTextSize, marginHorizontal: '3%', fontWeight: 'bold' }]}>{`Pedido recebido de: ${email}`}</Text>

          <View style={{ height: 2, backgroundColor: dividerLineColorDark, marginVertical: '1%' }}/>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={3} adjustsFontSizeToFit style={[{ fontSize: elderlyDescriptionTextSize }]}>{`O idoso ${name} com o email ${email} enviou-lhe um pedido!`}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.acceptButton, stylesButtons.mainConfig]} onPress={accept}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, marginVertical: '5%' }, newElderlyContainer.buttonText]}>{acceptLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, stylesButtons.rejectButton, stylesButtons.mainConfig]} onPress={refuse}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, marginVertical: '5%' }, newElderlyContainer.buttonText]}>{refuseLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export function ElderlyWaiting({elderlyEmail, setRefresh}: Readonly<{ elderlyEmail: string,  setRefresh: Function}>) {
  
  const { userId } = useSessionInfo()
  const cancel = () => cancelWaitingElderly(userId, elderlyEmail).then(() => setRefresh()) 

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: '4%'}}>
      <View style={[{ flexDirection: 'row', alignItems: 'center', marginVertical: '1%' }, elderlyStyle.sentRequestElderlyContainer]}>
        <View style={{ flex: 1, marginTop: '1%' }}>
          <Text numberOfLines={2} style={[{ fontSize: elderlyTitleTextSize, marginHorizontal: '3%', fontWeight: 'bold' }]}>{`Pedido enviado para: ${elderlyEmail}`}</Text>
          <View style={{ height: 2, backgroundColor: dividerLineColorDark, marginVertical: '2%' }}/>
          <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
            <Text numberOfLines={3} adjustsFontSizeToFit style={{ fontSize: elderlyDescriptionTextSize }}>{`À espera que o idoso com o email ${elderlyEmail} aceite o seu pedido.`}</Text>
          </View>
          <View style={{height: 1, marginVertical: '1%', marginHorizontal: '3%' }}/>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={[{flex: 0.5, marginHorizontal: '3%', marginBottom: '2%'}, stylesButtons.cancelButton, stylesButtons.mainConfig]} onPress={cancel}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, marginVertical: '5%' }, options.cancelLabelText]}>{cancelLabel}</Text>
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
  const { userId } = useSessionInfo()

  const deleteElderly = () => {
    decouplingElderly(userId, email).then(() => setRefresh())
  }

  const changeInfoState = () => setShowInfo(!showInfo)

  const navigateToElderlyCredentials = async () => {
    const sssKey = await getKeychainValueFor(elderlySSSKey(userId, elderlyId))
    
    if(sssKey == emptyValue) {
      Alert.alert('Informação', 'O Idoso foi informado que você aceitou a conexão, por favor aguarde.')
      return
    }

    navigation.navigate(pageElderlyCredentials, { elderlyEmail: email, elderlyName: name, elderlyId: elderlyId })
  }

  return (
    <View style={[{flex: 1, marginHorizontal: '4%', marginBottom: '3%'}, elderlyStyle.container]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '3%' }}>
        <Image source={require(caregiverImage)} style={{ width: 80, height: 90, borderRadius: 50, marginRight: 15 }} />
        <View style={{ flex: 1 }}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: elderlyDescriptionTextSize, marginTop: '3%', fontWeight: 'bold' }]}>{name}</Text>
          <View style={{ height: 1, backgroundColor: dividerLineColorDark, marginVertical: '2%' }} />
          <View style={{flex: 1, marginVertical: '3%', marginRight: '5%', flexDirection: 'row'}}>
            <TouchableOpacity style={[{flex: 0.6, marginHorizontal: '1%', marginVertical: '1%'}, stylesButtons.mainConfig, stylesButtons.cardButton]} onPress={navigateToElderlyCredentials}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginHorizontal: '2%', marginVertical: '4%' }]}>{'Credenciais'}</Text>
            </TouchableOpacity>
            <View style={{flex: 0.4, marginLeft: '1%'}}>
              <TouchableOpacity style={[{flex: 1, marginHorizontal: '2%', marginVertical: '2%', justifyContent: 'center',  alignItems: 'center'}, stylesButtons.moreInfoButton, stylesButtons.mainSlimConfig]} onPress={() => changeInfoState()}>
                {showInfo ? 
                <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                <FontAwesome name="chevron-down" size={34} color={arrowColor} />
                  <Text style={{color: arrowButtonTextColor}}>{filtersLabel}</Text>
                </View>
                :
                <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                  <FontAwesome name="chevron-up" size={34} color={arrowColor} />
                  <Text style={{color: arrowButtonTextColor}}>{seeLessLabel}</Text>
                </View>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {!showInfo ?
      <View>
          <View style={{ height: 2, backgroundColor: dividerLineColorDark, margin: '2%', marginTop: '5%' }} />
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
          <TouchableOpacity style={[{flex: 0.5, margin: '3%'}, decouplingOption.button, stylesButtons.mainConfig]} onPress={() => setModalVisible(true)}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, marginVertical: '2%' }, decouplingOption.buttonText]}>{unlinkLabel}</Text>
          </TouchableOpacity>
        </View>
      </View> : <></>}
      <YesOrNoModal question={'Concluir desvinculação?'} yesFunction={deleteElderly} noFunction={() => setModalVisible(false)} visibleFlag={modalVisible}/>
    </View>
  )
}