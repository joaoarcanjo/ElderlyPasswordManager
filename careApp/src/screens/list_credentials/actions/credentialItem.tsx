import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState } from "react"
import { Linking, TouchableOpacity, View, Text} from "react-native"
import { pageCredentialLogin, pageCredentialCard, actionsLabel } from "../../../assets/constants/constants"
import { stylesButtons } from "../../../assets/styles/main_style"
import { CredentialLoginOptionsModal, CredentialCardOptionsModal } from "../../../components/Modal"
import { copyValue } from "../../../components/userMessages/UserMessages"
import { copyUsernameDescription, copyPasswordDescription, copyCardNumberDescription, FlashMessage } from "../../../components/userMessages/messages"
import { styleScroolView } from "../styles/styles"
import { CredentialType } from "./types"
import { MaterialIcons } from "@expo/vector-icons"
import { useSessionInfo } from "../../../firebase/authentication/session"
import { deriveSecret } from "../../../algorithms/shamirSecretSharing/sss"
import { getKey } from "../../../firebase/firestore/functionalities"
import { getKeychainValueFor } from "../../../keychain"
import { elderlySSSKey } from "../../../keychain/constants"

export function ScrollItem({credential, elderlyId}: Readonly<{credential: CredentialType, elderlyId: string}>) {

    const navigation = useNavigation<StackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)
    const { localDBKey, userId } = useSessionInfo()
  
    const OpenCredentialPage = async () => {
      
        let encryptionKey = localDBKey
        if(elderlyId !== '') {
            const cloudKey = await getKey(elderlyId)
            const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
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
      const color = credential.data.type === 'login' ? 'orange' : 'purple'
      const username = 'username' in credential.data ? `Utilizador: ${credential.data.username}` : `Proprietário: ${credential.data.ownerName}`
    
      return (
        <>
        <View style={{flexDirection: 'row',  marginHorizontal: '2%'}}>
          <TouchableOpacity style={[{flex: 0.7, marginHorizontal: '1%', marginVertical: '2%'}, stylesButtons.mainConfig, stylesButtons.greyButton]} onPress={OpenCredentialPage}>
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
          </TouchableOpacity>
          <TouchableOpacity style={[{flex: 0.3, marginVertical: '2%'}, styleScroolView.navigateButton, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, margin: '3%', fontWeight: 'bold', textAlign: 'right' }]}>{actionsLabel}</Text>
          </TouchableOpacity>
        </View>
        { credential.data.type === 'login' ?
            <CredentialLoginOptionsModal visibleFlag={modalVisible} copyUsername={copyUsername} copyPassword={copyPassword} navigate={NavigateToApp} closeFunction={() => setModalVisible(false)}/>
          :
            <CredentialCardOptionsModal visibleFlag={modalVisible} copyCardNumber={copyCardNumber} copySecurityCode={copySecurityCode} copyVerificationCode={copyVerificationCode} closeFunction={() => setModalVisible(false)} />
        }
        </>
      )
    }