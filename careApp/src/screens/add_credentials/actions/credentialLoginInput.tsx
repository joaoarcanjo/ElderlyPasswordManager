import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import React, { useState, useEffect } from "react"
import { View, TextInput, TouchableOpacity, Text } from "react-native"
import { getScore } from "../../../algorithms/zxcvbn/algorithm"
import { placeholderPlatform, placeholderURI, placeholderUsername, placeholderPassword, addLabel, emptyValue, optionsLabel, regenerateLabel, usernameLabel, passwordLabel, uriLabel, platformLabel, seeMoreLabel, visibilityOffLabel, visibilityOnLabel, searchLabel } from "../../../assets/constants/constants"
import { stylesButtons } from "../../../assets/styles/main_style"
import AvaliationEmoji from "../../../components/EmojiAvaliation"
import { PasswordOptionsModal } from "../../../components/Modal"
import { regeneratePassword } from "../../../components/passwordGenerator/functions"
import { insertCredentialToLocalDB } from "../../../database/credentials"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../context/session"
import { addCredencialToFirestore } from "../../../firebase/firestore/functionalities"
import { sendElderlyCredentialInfoAction } from "../../credential_interface/actions/functions"
import { stylesInputsCredentials, stylesAddCredential, passwordFirstHalf } from "../styles/styles"
import { getNewId, encrypt } from "../../../algorithms/tweetNacl/crypto"
import { getSpecificUsernameAndPassword } from "../../../components/SpecificUsername&Password"
import { getKeychainValueFor } from "../../../keychain"
import { localDBKey as localDBKeyLabel } from '../../../keychain/constants';
import { darkGrey, color8, placeholderColor, usernameToPresentColor, passwordToPresentColor } from "../../../assets/styles/colors"
import { credencialCardDescriptionTextSize, credencialCardInputTextSize, credentialToPresent, buttonNormalTextSize, mediumTextSize } from "../../../assets/styles/text"
import { options } from "../../credential_interface/styles/styles"
import { Dropdown } from 'react-native-element-dropdown';
import { data } from "../../../assets/json/platforms2"

const jsonData = require('../../../assets/json/platforms.json')

export function CredentialsLoginInput({ ownerId, auxKey, isElderlyCredential }: Readonly<{ownerId: string, auxKey: string, isElderlyCredential: boolean }>) {
    const [platform, setPlatform] = useState(emptyValue)
    const [platformPlaceholder, setPlatformPlaceholder] = useState("Escolha uma plataforma")
    const [uri, setURI] = useState(emptyValue)
    const [username, setUsername] = useState(emptyValue)
    const [password, setPassword] = useState(emptyValue)
    const [avaliation, setAvaliation] = useState<number>(0)
    const [requirements, setRequirements] = useState<Object>({length: 15, strict: true, symbols: false, uppercase: true, lowercase: true, numbers: true})
    const [showPassword, setShowPassword] = useState(false)
    const navigation = useNavigation<StackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)

    const [usernameLabelToPresent, setUsernameLabelToPresent] = useState(emptyValue)
    const [passwordLabelToPresent, setPasswordLabelToPresent] = useState(emptyValue)

    const DropdownComponent = () => {
        const [value, setValue] = useState<any>(null);
        const [isFocus, setIsFocus] = useState(false);

        useEffect(() => {
            if(value != null) {
                setPlatformPlaceholder(value.platformPlaceholder)
                setPlatform(value.platformName)
                setURI(value.platformURI)
            }
            if(value == null && platform != emptyValue) {
                setPlatformPlaceholder(platformPlaceholder)
            }
        }, [value, isFocus])

        return (
            <Dropdown
              style={[{margin: '2%'}, stylesButtons.mainConfig, stylesButtons.cardButton]}
              placeholderStyle={{ fontSize: mediumTextSize, marginVertical: '2%', color: darkGrey }}
              selectedTextStyle={{ fontSize: mediumTextSize, marginVertical: '2%', color: darkGrey }}
              inputSearchStyle={{ height: 40, fontSize: 20, color: darkGrey }}
              iconStyle={{ width: 30, height: 30 }}
              data={data}
              search
              labelField="label"
              valueField="value"
              placeholder={platformPlaceholder}
              searchPlaceholder={searchLabel}
              value={value}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
              onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
              renderLeftIcon={() => (
                <MaterialCommunityIcons style={{marginHorizontal: 7}} color="black" name="form-dropdown" size={20} />
              )}
            />
            );
        };

    const { userId, userEmail, localDBKey } = useSessionInfo()

    useEffect(() => setAvaliation(getScore(password)), [password])

    useEffect(() => regeneratePassword(requirements, setPassword), [])
  
    useEffect(() => {
        const usenameAndPasswordLabel = getSpecificUsernameAndPassword(platform, jsonData)
        if(usenameAndPasswordLabel != null) {
            setUsernameLabelToPresent(usenameAndPasswordLabel.platformUsernameLabel)
            setPasswordLabelToPresent(usenameAndPasswordLabel.platformPasswordLabel)
            setURI(usenameAndPasswordLabel.platformURI)
        } else {
            setUsernameLabelToPresent(emptyValue)
            setPasswordLabelToPresent(emptyValue)
        }
    }, [platform])
    
    const handleSave = async () => {
        if(platform != emptyValue && uri != emptyValue && username != emptyValue && password != emptyValue) {
            const uuid = getNewId()
            const jsonValue = JSON.stringify({
                type: 'login',
                id: uuid,
                platform: platform, 
                uri: uri, 
                username: username, 
                password: password,
                edited: {
                    updatedBy: userEmail,
                    updatedAt: Date.now()
                }
            })
            await addCredencialToFirestore(ownerId, auxKey, uuid, jsonValue, isElderlyCredential)
            if(!isElderlyCredential) {
                 console.log("Local dbkey: ", await getKeychainValueFor(localDBKeyLabel(userId)))
                await insertCredentialToLocalDB(userId, uuid, encrypt(jsonValue, localDBKey))
            }
            
            if(ownerId != userId) await sendElderlyCredentialInfoAction(userId, ownerId, emptyValue, platform, ChatMessageType.CREDENTIALS_CREATED)
            navigation.goBack()
        }
    }

    const toggleShowPassword = () => setShowPassword(!showPassword)

    const saveRequirements = (requirements: Object) => {
        regeneratePassword(requirements, setPassword)
        setRequirements(requirements)
    }
    
    return (
        <View >
             <View style={{width: '100%', flexDirection: 'row'}}>
                 
                 <View style={[{flex: 1, marginHorizontal: '5%'}, stylesInputsCredentials.inputContainer]}>
                     
                     <DropdownComponent/>
                     <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '2%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize, color: darkGrey}]}>{platformLabel}*</Text>
                     
                     {
                     <View style={{flex: 1, flexDirection: 'row', margin: '4%', marginTop: '1%', marginRight: '2%'}}>
                         <View style={[{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                             <TextInput
                             placeholder={placeholderPlatform}
                             placeholderTextColor={placeholderColor}
                             value={platform}
                             autoFocus={true}
                             style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%', marginVertical: '1%', color: darkGrey }}
                             onChangeText={text => setPlatform(text)}
                             />
                         </View>
                     </View>}
                     <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize, color: darkGrey}]}>{uriLabel}*</Text>
                     <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                         <TextInput
                         placeholder={placeholderURI}
                         placeholderTextColor={placeholderColor}
                         value={uri}
                         autoCapitalize='none'
                         style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%', marginVertical: '1%' }}
                         onChangeText={text => setURI(text)}
                         />
                     </View>
                     <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize, color: darkGrey}]}>{usernameLabel}*</Text>
                     {usernameLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginHorizontal: '5%', fontSize: credentialToPresent, color: usernameToPresentColor}]}>{usernameLabelToPresent}</Text>}
                     <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                         <TextInput
                         placeholder={placeholderUsername}
                         placeholderTextColor={placeholderColor}
                         value={username}
                         autoCapitalize='none'
                         style={{ flex: 1, fontSize: credencialCardInputTextSize, padding: '2%', marginHorizontal: '1%', marginVertical: '1%', color: darkGrey }}
                         onChangeText={text => setUsername(text)}
                         />
                     </View>
                     <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credencialCardDescriptionTextSize, color: darkGrey}]}>{passwordLabel}</Text>
                     {passwordLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: credentialToPresent, color: passwordToPresentColor}]}>{passwordLabelToPresent}</Text>}
                     <View style={[{margin: '4%', marginTop: '1%'}, { borderRadius: 15, borderWidth: 1, backgroundColor: color8 }]}>
                         <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: '2%'}}>
                             <TextInput
                             placeholder={placeholderPassword}
                             placeholderTextColor={placeholderColor}
                             value={password}
                             style={{ flex: 1, fontSize: credencialCardInputTextSize, marginLeft: '1%', marginRight: '3%', marginVertical: '4%', color: darkGrey}}
                             secureTextEntry={showPassword}
                             onChangeText={text => setPassword(text)}
                             />
                             <AvaliationEmoji avaliation={avaliation}/>
                         </View>
                     </View>
                     <View style={{flexDirection: 'row', marginVertical: '5%', marginHorizontal: '3%'}}>
                         <TouchableOpacity style={[{flex: 0.40}, stylesButtons.optionsButton, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
                             <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, margin: '5%' }, options.optionsLabelText]}>{optionsLabel}</Text>
                         </TouchableOpacity>
                         {showPassword ?
                         <TouchableOpacity style={[{flex: 0.22, marginHorizontal: '2%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowPassword} >
                             <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye'} size={34} color={darkGrey}/> 
                             <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOnLabel}</Text>
                         </TouchableOpacity>
                         :
                         <TouchableOpacity style={[{flex: 0.22, marginHorizontal: '2%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowPassword} >
                             <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye-off'} size={34} color={darkGrey}/> 
                             <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOffLabel}</Text>
                         </TouchableOpacity>  
                         }
                         <TouchableOpacity style={[{flex: 0.40}, passwordFirstHalf.regenerateButton, stylesButtons.mainConfig]} onPress={() => regeneratePassword(requirements, setPassword)}>
                             <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: buttonNormalTextSize, margin: '5%', textAlign: 'center' }, options.generateLabelText]}>{regenerateLabel}</Text>
                         </TouchableOpacity>
                     </View>
                 </View>
             </View>
             <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.button, stylesButtons.mainConfig]} onPress={handleSave}>
                 <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.buttonText]}>{addLabel}</Text>
             </TouchableOpacity>
             <PasswordOptionsModal saveFunction={saveRequirements} closeFunction={() => {setModalVisible(false)}} visibleFlag={modalVisible} loading={false}/>
         </View>
    )
}