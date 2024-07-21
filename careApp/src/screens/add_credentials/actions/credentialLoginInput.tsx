import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState, useEffect } from "react"
import { View, TextInput, TouchableOpacity, Text } from "react-native"
import { getScore } from "../../../algorithms/zxcvbn/algorithm"
import { placeholderPlatform, placeholderURI, placeholderUsername, placeholderPassword, addLabel, emptyValue, optionsLabel, regenerateLabel, usernameLabel, passwordLabel, uriLabel, platformLabel, seeMoreLabel } from "../../../assets/constants/constants"
import { darkBlueBackground, whiteBackgroud } from "../../../assets/styles/colors"
import { stylesButtons } from "../../../assets/styles/main_style"
import AvaliationEmoji from "../../../components/EmojiAvaliation"
import { PasswordOptionsModal, PlatformSelectionModal } from "../../../components/Modal"
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

const jsonData = require('../../../assets/json/platforms.json')

export function CredentialsLoginInput({ ownerId, auxKey, isElderlyCredential }: Readonly<{ownerId: string, auxKey: string, isElderlyCredential: boolean }>) {
    const [platform, setPlatform] = useState(emptyValue)
    const [uri, setURI] = useState(emptyValue)
    const [username, setUsername] = useState(emptyValue)
    const [password, setPassword] = useState(emptyValue)
    const [avaliation, setAvaliation] = useState<number>(0)
    const [requirements, setRequirements] = useState<Object>({length: 15, strict: true, symbols: false, uppercase: true, lowercase: true, numbers: true})
    const [showPassword, setShowPassword] = useState(false)
    const navigation = useNavigation<StackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)
    const [platformModal, setPlatformModal] = useState(false)

    const [usernameLabelToPresent, setUsernameLabelToPresent] = useState(emptyValue)
    const [passwordLabelToPresent, setPasswordLabelToPresent] = useState(emptyValue)

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
        <View style={[{flex: 0.85}]}>
            <View style={{width: '100%', flexDirection: 'row'}}>
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '5%'}, stylesInputsCredentials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '2%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{platformLabel}</Text>
                    <View style={{flex: 1, flexDirection: 'row', margin: '4%', marginTop: '1%', marginRight: '2%'}}>
                        <View style={[{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder={placeholderPlatform}
                            value={platform}
                            autoFocus={true}
                            style={{ flex: 1, fontSize: 20, padding: '2%', marginHorizontal: '1%', marginVertical: '1%' }}
                            onChangeText={text => setPlatform(text)}
                            />
                        </View>
                        <TouchableOpacity style={[{justifyContent: 'center',  alignItems: 'center', marginHorizontal: '1%'}, stylesButtons.moreInfoButton, stylesButtons.mainSlimConfig]} onPress={() => {setPlatformModal(true)}}>
                            <View style={{margin: '2%', alignContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <FontAwesome name="arrow-circle-down" size={34} color={darkBlueBackground} />
                                <Text style={{marginLeft: '5%'}}>{seeMoreLabel}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{uriLabel}</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderURI}
                        value={uri}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 20, padding: '2%', marginHorizontal: '1%', marginVertical: '1%' }}
                        onChangeText={text => setURI(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{usernameLabel}</Text>
                    {usernameLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginHorizontal: '5%', fontSize: 15, color: darkBlueBackground}]}>{usernameLabelToPresent}</Text>}
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderUsername}
                        value={username}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 20, padding: '2%', marginHorizontal: '1%', marginVertical: '1%' }}
                        onChangeText={text => setUsername(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{passwordLabel}</Text>
                    {passwordLabelToPresent != emptyValue && <Text numberOfLines={2} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 15, color: darkBlueBackground}]}>{passwordLabelToPresent}</Text>}
                    <View style={[{margin: '4%', marginTop: '1%'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: '2%'}}>
                            <TextInput
                            placeholder={placeholderPassword}
                            value={password}
                            style={{ flex: 1, fontSize: 17, marginLeft: '1%', marginRight: '3%', marginVertical: '4%'}}
                            secureTextEntry={showPassword}
                            onChangeText={text => setPassword(text)}
                            />
                            <AvaliationEmoji avaliation={avaliation}/>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: '5%', marginHorizontal: '3%'}}>
                        <TouchableOpacity style={[{flex: 0.40}, stylesButtons.optionsButton, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 24, margin: '5%' }]}>{optionsLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.20, marginHorizontal: '3%', flexDirection: 'row'}, stylesButtons.visibilityButton, stylesButtons.mainConfig]} onPress={toggleShowPassword} >
                            <MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={35} color="black"/> 
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.40}, passwordFirstHalf.regenerateButton, stylesButtons.mainConfig]} onPress={() => regeneratePassword(requirements, setPassword)}>
                            <Text numberOfLines={2} adjustsFontSizeToFit style={[{ fontSize: 24, margin: '5%', textAlign: 'center' }]}>{regenerateLabel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.button, stylesButtons.mainConfig]} onPress={handleSave}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.buttonText]}>{addLabel}</Text>
            </TouchableOpacity>
            <PasswordOptionsModal saveFunction={saveRequirements} closeFunction={() => {setModalVisible(false)}} visibleFlag={modalVisible} loading={false}/>
            <PlatformSelectionModal closeFunction={() => { setPlatformModal(false) } } visibleFlag={platformModal} setPlatformName={setPlatform} setPlatformURI={setURI}/>
        </View>
    )
}