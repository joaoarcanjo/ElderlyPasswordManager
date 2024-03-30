import React, { useEffect, useState } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { stylesButtons } from "../../../assets/styles/main_style";
import { passwordFirstHalf, stylesAddCredential, stylesInputsCredencials } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import Navbar from "../../../navigation/actions";
import { addCredencialToFirestore } from "../../../firebase/firestore/functionalities";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Algorithm from "../../password_generator/actions/algorithm";
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import MainBox from "../../../components/MainBox";
import AvaliationEmoji from "../../../components/EmojiAvaliation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { encrypt, getNewId } from "../../../algorithms/0thers/crypto";
import { sendElderlyCredentialInfoAction } from "../../credential_interface/actions/functions";
import { useSessionInfo } from "../../../firebase/authentication/session";
import { ChatMessageType } from "../../../e2e/messages/types";
import { insertCredentialToLocalDB } from "../../../database/credentials";
import { regeneratePassword } from "../../../components/passwordGenerator/functions";
import { PasswordOptionsModal } from "../../../components/Modal";

const placeholderPlatform = 'Insira a plataforma'
const placeholderURI = 'Insira o URI da plataforma'
const placeholderUsername = 'Insira o seu username'
const placeholderPassword = "Insira a password"

function CredentialsInput({ ownerId, auxKey, isElderlyCredential }: Readonly<{ownerId: string, auxKey: string, isElderlyCredential: boolean }>) {
    const [platform, setPlatform] = useState('')
    const [uri, setURI] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [avaliation, setAvaliation] = useState<number>(0)
    const [requirements, setRequirements] = useState<Object>({length: 15, strict: true, symbols: false, uppercase: true, lowercase: true, numbers: true})
    const [showPassword, setShowPassword] = useState(false)
    const navigation = useNavigation<StackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = useState(false)

    const { userId, userEmail, localDBKey } = useSessionInfo()

    useEffect(() => setAvaliation(getScore(password)), [password])

    useEffect(() => regeneratePassword(requirements, setPassword), [])
  
    const handleSave = async () => {
        if(platform != '' && uri != '' && username != '' && password != '') {
            const uuid = getNewId()
            const jsonValue = JSON.stringify({
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
            await insertCredentialToLocalDB(userId, uuid, encrypt(jsonValue, localDBKey))
            
            if(ownerId != userId) await sendElderlyCredentialInfoAction(userId, ownerId, '', platform, ChatMessageType.CREDENTIALS_CREATED)
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
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '5%'}, stylesInputsCredencials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '2%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Platform</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderPlatform}
                        value={platform}
                        autoFocus={true}
                        style={{ flex: 1, fontSize: 22, padding: '2%', marginHorizontal: '5%' }}
                        onChangeText={text => setPlatform(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>URI</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderURI}
                        value={uri}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 22, padding: '2%', marginHorizontal: '5%' }}
                        onChangeText={text => setURI(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Username</Text>
                    <View style={[{margin: '4%', marginTop: '1%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderUsername}
                        value={username}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 22, padding: '2%', marginHorizontal: '5%' }}
                        onChangeText={text => setUsername(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Password</Text>
                    <View style={[{margin: '4%', marginTop: '1%'}, { borderRadius: 15, borderWidth: 1, backgroundColor: whiteBackgroud }]}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: '5%'}}>
                            <TextInput
                            multiline={true}
                            numberOfLines={2}
                            placeholder={placeholderPassword}
                            value={password}
                            style={{ flex: 1, fontSize: 22, marginRight: '5%', padding: '3%'}}
                            secureTextEntry={!showPassword}
                            onChangeText={text => setPassword(text)}
                            />
                            <AvaliationEmoji avaliation={avaliation}/>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: '5%', marginHorizontal: '3%'}}>
                        <TouchableOpacity style={[{flex: 0.40}, stylesButtons.blueButton, stylesButtons.mainConfig]} onPress={() => {setModalVisible(true)}}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Opções</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.20, marginHorizontal: '3%', flexDirection: 'row'}, stylesButtons.visibilityButton, stylesButtons.mainConfig]}  onPress={toggleShowPassword} >
                            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={35} color="black"/> 
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.40}, passwordFirstHalf.regenerateButton, stylesButtons.mainConfig]} onPress={() => regeneratePassword(requirements, setPassword)}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Regenerar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.button, stylesButtons.mainConfig]} onPress={handleSave}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.buttonText]}>ADICIONAR</Text>
            </TouchableOpacity>
            <PasswordOptionsModal saveFunction={saveRequirements} closeFunction={() => {setModalVisible(false)}} visibleFlag={modalVisible} loading={false}/>
        </View>
    )
}

export function AddCredencial({ route }: Readonly<{route: any}>) {
    return (
        <>
        <KeyboardAvoidingWrapper>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainBox text="Adicionar credencial"/>
                <CredentialsInput auxKey={route.params.key} ownerId={route.params.userId} isElderlyCredential={route.params.isElderlyCredential}  />
            </View>
        </KeyboardAvoidingWrapper>
        <Navbar/>
        </>
    )
}