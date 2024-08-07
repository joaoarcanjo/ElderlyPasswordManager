import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState } from "react"
import { Linking, TouchableOpacity, View, Text} from "react-native"
import { pageCredentialLogin, pageCredentialCard, copyCardNumberLabel, copyPasswordLabel, copySecurityCodeLabel, copyUsernameLabel, copyVerificationCodeLabel, navigateLabel, closeLabel, seeMoreLabel, seeLessLabel } from "../../../assets/constants/constants"
import { stylesButtons } from "../../../assets/styles/main_style"
import { CredentialType } from "./types"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { useSessionInfo } from "../../../context/session"
import { deriveSecret } from "../../../algorithms/shamirSecretSharing/sss"
import { getKeychainValueFor } from "../../../keychain"
import { elderlySSSKey } from "../../../keychain/constants"
import { arrowButtonTextColor, arrowColor, cardColor, credentialItemButtonTextColor,  dividerLineColorLight, loginColor } from "../../../assets/styles/colors"
import { styleScroolView } from "../styles/styles"
import { getShare } from "../../../firebase/firestore/functionalities"
import { credencialsPlatformLabelTextSize, credencialsUsernameTextSize } from "../../../assets/styles/text"
import { options } from "../../credential_interface/styles/styles"
import { copyCardNumberDescription, copyPasswordDescription, copyUsernameDescription, FlashMessage } from "../../../assets/constants/messages"
import { copyValue } from "../../../notifications/UserMessages"

function ActionItem({text, func} : {text: string, func: Function}) {

  const color = text.includes('Copiar') ? stylesButtons.copyButton : stylesButtons.navigateButton
  const textStyle = text.includes('Copiar') ? options.copyButtonText : options.navigateButtonText

  return (
    <TouchableOpacity style={[{flex: 1, marginTop: '3%'}, stylesButtons.mainConfig, color]} onPress={() => func()}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginVertical: '4%'}, textStyle]}>{text}</Text>
    </TouchableOpacity>
  )
}
export function ScrollItem({credential, elderlyId}: Readonly<{credential: CredentialType, elderlyId: string}>) {

    const navigation = useNavigation<StackNavigationProp<any>>()
    const { localDBKey, userId } = useSessionInfo()
    const [showFilter, setShowFilter] = useState(false)
  
    const OpenCredentialPage = async () => {
      
        let encryptionKey = localDBKey
        if(elderlyId !== '') {
            const cloudKey = await getShare(elderlyId)
            const sssKey = await getKeychainValueFor(elderlySSSKey(userId, elderlyId))
            encryptionKey = deriveSecret([cloudKey, sssKey]) 
        }

        if ('uri' in credential.data) {
            navigation.navigate(pageCredentialLogin, 
            { 
                id: credential.id, 
                userId: elderlyId != '' ? elderlyId : userId,
                platform: credential.data.platform, 
                uri: credential.data.uri, 
                edited: credential.data.edited,
                username: credential.data.username, 
                password: credential.data.password,
                key: encryptionKey,
                isElderlyCredential: elderlyId != ''
            })
        } else if ('cardNumber' in credential.data) {
            navigation.navigate(pageCredentialCard, 
            { 
                id: credential.id, 
                userId: elderlyId != '' ? elderlyId : userId,
                platform: credential.data.platform, 
                cardNumber: credential.data.cardNumber, 
                ownerName: credential.data.ownerName, 
                securityCode: credential.data.securityCode, 
                verificationCode: credential.data.verificationCode,
                edited: credential.data.edited,
                key: encryptionKey,
                isElderlyCredential: elderlyId != ''
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
      const color = credential.data.type === 'login' ? loginColor : cardColor
      const usernamePre = 'username' in credential.data ? `Utilizador:` : `Titular:`
      const username = 'username' in credential.data ? `${credential.data.username}` : `${credential.data.ownerName}`
    
      return (
        <>
        <View style={{flexDirection: 'row',  marginHorizontal: '2%'}}>
          <TouchableOpacity style={[{flex: 1, marginHorizontal: '1%', marginVertical: '2%'}, styleScroolView.credentialContainer, stylesButtons.mainSlimConfigNotCenter]} onPress={OpenCredentialPage}>
            <View style={{flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', margin: '2%'}}>
              <View style={{flex: 0.7}}>
                <View style={{flexDirection: 'row', marginHorizontal: '1%'}}>
                  <View style={{marginVertical: '1%'}}>
                    <MaterialIcons name={icone} size={40} color={color}/> 
                  </View>
                  <View style={{marginVertical: '3%', marginHorizontal: '2%', flexDirection: 'row', alignItems: 'center'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: credencialsPlatformLabelTextSize, fontWeight: 'bold', color: credentialItemButtonTextColor }]}>{credential.data.platform}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginHorizontal: '1%', marginVertical: '2%'}}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: credencialsUsernameTextSize, marginLeft: '1%', fontWeight: 'bold', color: credentialItemButtonTextColor }]}>{usernamePre}</Text>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: credencialsUsernameTextSize, marginLeft: '3%', color: credentialItemButtonTextColor }]}>{username}</Text>
                </View>
              </View>
              <View style={{flex: 0.25}}>
                <TouchableOpacity style={[stylesButtons.moreInfoButton, stylesButtons.mainSlimConfig]} onPress={() => {setShowFilter(!showFilter)}}>
                  {!showFilter ? 
                  <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name="chevron-down" size={40} color={arrowColor} />
                    <Text style={{color: arrowButtonTextColor}}>{seeMoreLabel}</Text>
                  </View>
                  :
                  <View style={{marginVertical: '5%', alignContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name="chevron-up" size={40} color={arrowColor} />
                    <Text style={{color: arrowButtonTextColor}}>{seeLessLabel}</Text>
                  </View>}
                </TouchableOpacity>
              </View>
            </View>
            {showFilter ?
              <View style={{flex: 0.7, margin: '3%'}}>
              <View style={{ height: 1, backgroundColor: dividerLineColorLight }} />
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