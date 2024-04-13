import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Linking, View, TouchableOpacity, Text } from "react-native";
import { pageCredentialLogin, pageCredentialCard, detailsLabel, actionsLabel } from "../../../assets/constants";
import { stylesButtons } from "../../../assets/styles/main_style";
import { useSessionInfo } from "../../../firebase/authentication/session";
import { sendPushNotification } from "../../../notifications/functionalities";
import { usePushNotifications } from "../../../notifications/usePushNotifications";
import { styleScroolView } from "../styles/styles";
import { CredentialType } from "./types";
import React, { useState } from "react";
import { copyValue } from "../../../components/userMessages/UserMessages";
import { copyUsernameDescription, copyPasswordDescription, FlashMessage, copyCardNumberDescription } from "../../../components/userMessages/messages";
import { CredentialLoginOptionsModal, CredentialCardOptionsModal } from "../../../components/Modal";
import { MaterialIcons } from "@expo/vector-icons";

export function ScrollItem({credential}: Readonly<{credential: CredentialType}>) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { setUsernameCopied, setPasswordCopied, usernameCopied, passwordCopied } = useSessionInfo()
    const { expoPushToken } = usePushNotifications()
    const [modalVisible, setModalVisible] = useState(false)
  
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
          setModalVisible(false)
        }
      }
    
      const copyPassword = () => {
        if ('password' in credential.data) {
          copyValue(credential.data.password, FlashMessage.passwordCopied, copyPasswordDescription)
          setModalVisible(false)
        }
      }
    
      const copyCardNumber = () => {
        if ('cardNumber' in credential.data) {
          copyValue(credential.data.cardNumber, FlashMessage.cardNumberCopied, copyCardNumberDescription)
          setModalVisible(false)
        }
      }
    
      const copySecurityCode = () => {
        if ('securityCode' in credential.data) {
          copyValue(credential.data.securityCode, FlashMessage.securityCodeCopied, copyCardNumberDescription)
          setModalVisible(false)
        }
      }
    
      const copyVerificationCode = () => {
        if ('verificationCode' in credential.data) {
          copyValue(credential.data.verificationCode, FlashMessage.verificationCodeCopied, copyCardNumberDescription)
          setModalVisible(false)
        }
      }

      const icone = credential.data.type === 'login' ? 'person' : 'credit-card'
      const color = credential.data.type === 'login' ? 'orange' : 'purple'
    
      return (
        <>
        <TouchableOpacity style={[{marginHorizontal: '3%', marginVertical: '2%', flexDirection: 'row', justifyContent: 'space-between'}, stylesButtons.mainConfig, stylesButtons.greyButton]} onPress={OpenCredentialPage}>
          <View style={{marginHorizontal: '2%'}}>
            <MaterialIcons style={{marginRight: '1%'}} name={icone} size={25} color={color}/> 
          </View>
          <View style={{flex: 0.7, marginVertical: '3%', marginHorizontal: '2%', flexDirection: 'row', alignItems: 'center'}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 30, fontWeight: 'bold' }]}>{credential.data.platform}</Text>
          </View>
          <TouchableOpacity style={[{flex: 0.3, marginHorizontal: '2%', marginVertical: '2%'}, styleScroolView.navigateButton, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%' }]}>{actionsLabel}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        { credential.data.type === 'login' ?
           <CredentialLoginOptionsModal visibleFlag={modalVisible} copyUsername={copyUsername} copyPassword={copyPassword} navigate={NavigateToApp} closeFunction={() => setModalVisible(false)}/>
          :
           <CredentialCardOptionsModal visibleFlag={modalVisible} copyCardNumber={copyCardNumber} copySecurityCode={copySecurityCode} copyVerificationCode={copyVerificationCode} closeFunction={() => setModalVisible(false)} />
        }
        </>
      )
    }