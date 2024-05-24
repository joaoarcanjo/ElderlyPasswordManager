import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Linking, View, TouchableOpacity, Text, Image } from "react-native";
import { pageCredentialLogin, pageCredentialCard, copyPasswordLabel, copyUsernameLabel, navigateLabel, copyCardNumberLabel, copySecurityCodeLabel, copyVerificationCodeLabel, optionsLabel, closeLabel, actionsLabel, seeMoreLabel } from "../../../assets/constants/constants";
import { stylesButtons } from "../../../assets/styles/main_style";
import { useSessionInfo } from "../../../firebase/authentication/session";
import { usePushNotifications } from "../../../notifications/usePushNotifications";
import { CredentialType } from "./types";
import React, { useState } from "react";
import { copyValue } from "../../../components/UserMessages";
import { copyUsernameDescription, copyPasswordDescription, FlashMessage, copyCardNumberDescription } from "../../../assets/constants/messages";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { darkBlueBackground } from "../../../assets/styles/colors";

function ActionItem({text, func} : {text: string, func: Function}) {

  const color = text.includes('Copiar') ? stylesButtons.copyButton : stylesButtons.blueButton

  return (
    <TouchableOpacity style={[{flex: 1, marginTop: '3%'}, stylesButtons.mainConfig, color]} onPress={() => func()}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '1%' }]}>{text}</Text>
    </TouchableOpacity>
  )
}

export function ScrollItem({credential}: Readonly<{credential: CredentialType}>) {
    const navigation = useNavigation<StackNavigationProp<any>>()
    const { setUsernameCopied, setPasswordCopied, usernameCopied, passwordCopied } = useSessionInfo()
    const { expoPushToken } = usePushNotifications()
    const [showFilter, setShowFilter] = useState(false)
  
    const OpenCredentialPage = () => {
      if ('uri' in credential.data) {
        navigation.navigate(pageCredentialLogin, 
          { 
            id: credential.id, 
            platform: credential.data.platform, 
            uri: credential.data.uri, 
            edited: credential.data.edited,
            username: credential.data.username, 
            password: credential.data.password 
          })
      } else if ('cardNumber' in credential.data) {
        navigation.navigate(pageCredentialCard, 
          { 
            id: credential.id, 
            platform: credential.data.platform, 
            cardNumber: credential.data.cardNumber, 
            ownerName: credential.data.ownerName, 
            securityCode: credential.data.securityCode, 
            verificationCode: credential.data.verificationCode,
            edited: credential.data.edited 
          })
      }
    }
  
    const NavigateToApp = async () => { 
        if ('uri' in credential.data) {
          //setUsernameCopied(username)
          //setPasswordCopied(password)
          const message = {
            //to: expoPushToken?.data,
            sound: "default",
            title: "Credenciais " + credential.data.platform,
            body: "Copie em seguida o que necessita:",
            data: {},
            categoryId: `credentials`
          }
          //sendPushNotification(message)
          Linking.openURL('https://'+credential.data.uri)
        }
      }
    
      const copyUsername = () => {
        if ('username' in credential.data) {
          copyValue(credential.data.username, FlashMessage.usernameCopied, copyUsernameDescription)
        }
      }
    
      const copyPassword = () => {
        if ('password' in credential.data) {
          copyValue(credential.data.password, FlashMessage.passwordCopied, copyPasswordDescription)
        }
      }
    
      const copyCardNumber = () => {
        if ('cardNumber' in credential.data) {
          copyValue(credential.data.cardNumber, FlashMessage.cardNumberCopied, copyCardNumberDescription)
        }
      }
    
      const copySecurityCode = () => {
        if ('securityCode' in credential.data) {
          copyValue(credential.data.securityCode, FlashMessage.securityCodeCopied, copyCardNumberDescription)
        }
      }
    
      const copyVerificationCode = () => {
        if ('verificationCode' in credential.data) {
          copyValue(credential.data.verificationCode, FlashMessage.verificationCodeCopied, copyCardNumberDescription)
        }
      }

      const icone = credential.data.type === 'login' ? 'person' : 'credit-card'
      const color = credential.data.type === 'login' ? 'orange' : 'purple'
      const username = 'username' in credential.data ? `Utilizador: ${credential.data.username}` : `Proprietário: ${credential.data.ownerName}`
    
      return (
        <>
        <View style={{flexDirection: 'row',  marginHorizontal: '2%'}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '1%', marginVertical: '2%'}, stylesButtons.greyButton, stylesButtons.mainSlimConfigNotCenter]} onPress={OpenCredentialPage}>
            <View style={{flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', margin: '2%'}}>
              <View style={{flex: 0.7}}>
                <View style={{flexDirection: 'row', marginHorizontal: '1%'}}>
                  <View style={{marginVertical: '1%'}}>
                    <MaterialIcons name={icone} size={40} color={color}/> 
                  </View>
                  <View style={{marginVertical: '3%', marginHorizontal: '2%', flexDirection: 'row', alignItems: 'center'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 25, fontWeight: 'bold' }]}>{credential.data.platform}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '1%', marginVertical: '2%'}}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 15, marginLeft: '5%' }]}>{username}</Text>
                </View>
              </View>
              <View style={{flex: 0.25}}>
                <TouchableOpacity style={[stylesButtons.whiteButton, stylesButtons.mainSlimConfig]} onPress={() => {setShowFilter(!showFilter)}}>
                  {!showFilter ? 
                  <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name="arrow-circle-down" size={40} color={darkBlueBackground} />
                    <Text>{seeMoreLabel}</Text>
                  </View>
                  :
                  <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name="arrow-circle-up" size={40} color={darkBlueBackground} />
                    <Text>{closeLabel}</Text>
                  </View>}
                </TouchableOpacity>
              </View>
            </View>
            {showFilter ?
              <View style={{flex: 0.7, margin: '3%'}}>
                <View style={{ height: 1, backgroundColor: '#ccc' }} />
                <View style={{ height: 1, backgroundColor: '#ccc' }} />
                <View style={{marginTop: '4%', marginHorizontal: '2%'}}>
                  {'uri' in credential.data ? 
                    <>
                      <ActionItem text={copyUsernameLabel} func={copyUsername}/>
                      <ActionItem text={copyPasswordLabel} func={copyPassword}/>
                      <ActionItem text={navigateLabel} func={NavigateToApp}/>
                    </>
                    : <></>}
                  {'cardNumber' in credential.data ?
                    <>
                      <ActionItem text={copyCardNumberLabel} func={copyCardNumber}/>
                      <ActionItem text={copySecurityCodeLabel} func={copySecurityCode}/>
                      <ActionItem text={copyVerificationCodeLabel} func={copyVerificationCode}/>
                    </>
                    : <></>}
                </View>
              </View> : <></>}
          </TouchableOpacity>
        </View>
        </>
      )
    }