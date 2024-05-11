import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState, useEffect } from "react"
import { View, TextInput, TouchableOpacity, Text } from "react-native"
import { getScore } from "../../../algorithms/zxcvbn/algorithm"
import { passwordDefaultLengthGenerator, placeholderPlatform, placeholderURI, usernameLabel, placeholderUsername, passwordLabel, placeholderPassword, optionsLabel, regenerateLabel, addLabel, platformLabel, uriLabel, emptyValue } from "../../../assets/constants/constants"
import { darkOrangeBackground, whiteBackgroud } from "../../../assets/styles/colors"
import { stylesButtons } from "../../../assets/styles/main_style"
import AvaliationEmoji from "../../../components/EmojiAvaliation"
import { PasswordOptionsModal, PlatformSelectionModal } from "../../../components/Modal"
import { regeneratePassword } from "../../../components/passwordGenerator/functions"
import { credentialCreatedFlash } from "../../../components/UserMessages"
import { insertCredentialToLocalDB } from "../../../database/credentials"
import { ChatMessageType } from "../../../e2e/messages/types"
import { useSessionInfo } from "../../../firebase/authentication/session"
import { addCredencialToFirestore } from "../../../firebase/firestore/functionalities"
import { sendCaregiversCredentialInfoAction } from "../../credential_interface/actions/functions"
import { stylesInputsCredencials, stylesAddCredential } from "../styles/styles"
import { encrypt, getNewId } from "../../../algorithms/tweetNacl/crypto"

export default function CredentialsLoginInput() {

    const [platform, setPlatform] = useState(emptyValue)
    const [uri, setURI] = useState(emptyValue)
    const [username, setUsername] = useState(emptyValue)
    const [password, setPassword] = useState(emptyValue)
    const [avaliation, setAvaliation] = useState<number>(0)
    const [requirements, setRequirements] = useState<Object>({length: passwordDefaultLengthGenerator, strict: true, symbols: false, uppercase: true, lowercase: true, numbers: true})
    const [showPassword, setShowPassword] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [platformModal, setPlatformModal] = useState(false)
    const navigation = useNavigation<StackNavigationProp<any>>()
    const { userId, userEmail, localDBKey } = useSessionInfo()

    useEffect(() => setAvaliation(getScore(password)), [password])

    useEffect(() => regeneratePassword(requirements, setPassword), [])
  
    const handleSave = async () => {
        try {
            if(platform != emptyValue && uri != emptyValue && username != emptyValue && password != emptyValue) {
                const uuid = getNewId()
                const jsonValue = JSON.stringify({
                    id: uuid,
                    type: 'login',
                    platform: platform, 
                    uri: uri, 
                    username: username, 
                    password: password,
                    edited: {
                        updatedBy: userEmail,
                        updatedAt: Date.now()
                    }
                })
                await addCredencialToFirestore(userId, uuid, jsonValue)
                await insertCredentialToLocalDB(userId, uuid, encrypt(jsonValue, localDBKey))
                await sendCaregiversCredentialInfoAction(userId, emptyValue, platform, ChatMessageType.CREDENTIALS_CREATED)
                credentialCreatedFlash(userEmail, platform, true)
                navigation.goBack()
            }
        } catch (error) {
            console.log('#1 Error creating credential')
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
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '5%'}, stylesInputsCredencials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '2%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{platformLabel}</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderPlatform}
                        value={platform}
                        autoFocus={true}
                        style={{ flex: 1, fontSize: 20, padding: '2%', marginHorizontal: '1%' }}
                        onChangeText={text => setPlatform(text)}
                        />
                        <TouchableOpacity style={[{flex: 0.15, marginHorizontal: '3%'}]} onPress={() => {setPlatformModal(true)}}>
                            <MaterialCommunityIcons name='auto-fix' size={35} color={darkOrangeBackground}/>
                        </TouchableOpacity>
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{uriLabel}</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderURI}
                        value={uri}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 20, padding: '2%', marginHorizontal: '1%' }}
                        onChangeText={text => setURI(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{usernameLabel}</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderUsername}
                        value={username}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 20, padding: '2%', marginHorizontal: '1%' }}
                        onChangeText={text => setUsername(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>{passwordLabel}</Text>
                    <View style={[{margin: '4%', marginTop: '1%'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: '2%'}}>
                            <TextInput
                            placeholder={placeholderPassword}
                            value={password}
                            style={{ flex: 1, fontSize: 17, marginRight: '3%', marginVertical: '4%'}}
                            secureTextEntry={showPassword}
                            onChangeText={text => setPassword(text)}
                            />
                            <AvaliationEmoji avaliation={avaliation}/>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: '5%', marginHorizontal: '3%'}}>
                        <TouchableOpacity style={[{flex: 0.40}, stylesButtons.blueButton, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>{optionsLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.20, marginHorizontal: '3%', flexDirection: 'row'}, stylesButtons.visibilityButton, stylesButtons.mainConfig]}  onPress={toggleShowPassword} >
                            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={35} color="black"/> 
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.40}, stylesButtons.regenerateButton, stylesButtons.mainConfig]} onPress={() => regeneratePassword(requirements, setPassword)}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>{regenerateLabel}</Text>
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