import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState } from "react"
import { View, TextInput, TouchableOpacity, Text } from "react-native"
import { addLabel, placeholderSecurityCode, placeholderOwnerName, placeholderCardNumber, securityCodeLabel, cardNumberLabel, ownerNameLabel, placeholderCardPlatform, cardPlatformLabel, verificationCodeLabel, placeholderVerificationCode, emptyValue, visibilityOnLabel, visibilityOffLabel } from "../../../assets/constants/constants"
import { color8, darkGrey, placeholderColor } from "../../../assets/styles/colors"
import { stylesButtons } from "../../../assets/styles/main_style"
import { insertCredentialToLocalDB } from "../../../database/credentials"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../context/session"
import { addCredencialToFirestore } from "../../../firebase/firestore/functionalities"
import { sendCaregiversCredentialInfoAction } from "../../credential_interface/actions/functions"
import { stylesInputsCredentials, stylesAddCredential } from "../styles/styles"
import { encrypt, getNewId } from "../../../algorithms/tweetNacl/crypto"
import { credentialCreatedFlash } from "../../../notifications/UserMessages"
import { getKeychainValueFor } from "../../../keychain"
import { elderlyFireKey } from "../../../keychain/constants"
import { credencialCardDescriptionTextSize, credencialCardInputTextSize } from "../../../assets/styles/text"

export default function CredentialsCardInput() {

    const [platform, setPlatform] = useState(emptyValue)
    const [ownerName, setOwnerName] = useState(emptyValue)
    const [cardNumber, setCardNumber] = useState(emptyValue)
    const [securityCode, setSecurityCode] = useState(emptyValue)
    const [verificationCode, setVerificationCode] = useState(emptyValue)
    const [showSecurityCode, setShowSecurityCode] = useState(false)
    const navigation = useNavigation<StackNavigationProp<any>>()
    const { userId, userEmail, localDBKey } = useSessionInfo()
  
    const handleSave = async () => {
        try {
            if(platform != emptyValue && ownerName != emptyValue && cardNumber != emptyValue && securityCode != emptyValue && verificationCode != emptyValue) {
                const uuid = getNewId()
                const jsonValue = JSON.stringify({
                    id: uuid,
                    type: 'card',
                    platform: platform, 
                    ownerName: ownerName, 
                    cardNumber: cardNumber, 
                    securityCode: securityCode,
                    verificationCode: verificationCode,
                    edited: {
                        updatedBy: userEmail,
                        updatedAt: Date.now()
                    }
                })
                const userKey = await getKeychainValueFor(elderlyFireKey(userId))
                await addCredencialToFirestore(userId, userKey, uuid, jsonValue)
                await insertCredentialToLocalDB(userId, uuid, encrypt(jsonValue, localDBKey))
                await sendCaregiversCredentialInfoAction(userId, emptyValue, platform, ChatMessageType.CREDENTIALS_CREATED)
                credentialCreatedFlash(userEmail, platform, true)
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
            console.log('#1 Error creating credential')
        }
    }

    const toggleShowSecurityCode = () => setShowSecurityCode(!showSecurityCode)

    return (
        <View style={[{flex: 0.85}]}>
            <View style={{width: '100%', flexDirection: 'row'}}>
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '5%'}, stylesInputsCredentials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '2%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{cardPlatformLabel}*</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                        <TextInput
                        placeholder={placeholderCardPlatform}
                        placeholderTextColor={placeholderColor}
                        value={platform}
                        autoFocus={true}
                        style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%' }}
                        onChangeText={text => setPlatform(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{ownerNameLabel}*</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                        <TextInput
                        placeholder={placeholderOwnerName}
                        placeholderTextColor={placeholderColor}
                        value={ownerName}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%' }}
                        onChangeText={text => setOwnerName(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{cardNumberLabel}*</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                        <TextInput
                        placeholder={placeholderCardNumber}
                        placeholderTextColor={placeholderColor}
                        value={cardNumber}
                        keyboardType='numeric'
                        style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%' }}
                        onChangeText={text => setCardNumber(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{securityCodeLabel}*</Text>
                    <View style={[{margin: '4%', marginTop: '1%'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: '2%'}}>
                            <TextInput
                            placeholder={placeholderSecurityCode}
                            placeholderTextColor={placeholderColor}
                            value={securityCode}
                            keyboardType='numeric'
                            style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%'}}
                            secureTextEntry={showSecurityCode}
                            onChangeText={text => setSecurityCode(text)}
                            />
                        </View>
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize}]}>{verificationCodeLabel}*</Text>
                    <View style={[{margin: '4%', marginTop: '1%'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: '2%'}}>
                            <TextInput
                            placeholder={placeholderVerificationCode}
                            placeholderTextColor={placeholderColor}
                            value={verificationCode}
                            style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%'}}
                            secureTextEntry={showSecurityCode}
                            onChangeText={text => setVerificationCode(text)}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: '2%', marginBottom: '5%', marginHorizontal: '3%'}}>
                        {showSecurityCode ?
                        <TouchableOpacity style={[{marginHorizontal: '3%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowSecurityCode} >
                            <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye'} size={34} color={darkGrey}/> 
                            <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOnLabel}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[{marginHorizontal: '3%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowSecurityCode} >
                            <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye-off'} size={34} color={darkGrey}/> 
                            <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOffLabel}</Text>
                        </TouchableOpacity>  
                        }
                    </View>
                </View>
            </View>
            <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.button, stylesButtons.mainConfig]} onPress={handleSave}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.buttonText]}>{addLabel}</Text>
            </TouchableOpacity>
        </View>
    )
}