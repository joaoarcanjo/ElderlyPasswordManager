import React, { useEffect, useState } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { stylesButtons } from "../../../assets/styles/main_style";
import { passwordFirstHalf, stylesAddCredential, stylesInputsCredencials } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import Navbar from "../../../navigation/actions";
import { addCredencial, getKey } from "../../../firebase/firestore/functionalities";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Algorithm from "../../password_generator/actions/algorithm";
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import MainBox from "../../../components/MainBox";
import AvaliationEmoji from "../../../components/EmojiAvaliation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getNewId } from "../../../algorithms/0thers/crypto";
import { deriveSecret } from "../../../algorithms/sss/sss";

const placeholderPlatform = 'Insira a plataforma'
const placeholderURI = 'Insira o URI da plataforma'
const placeholderUsername = 'Insira o seu username'
const placeholderPassword = "Insira a password"

function CredentialsInput({ userId, isElderlyCredential, auxKey }: {userId: string, key: string, isElderlyCredential: boolean, auxKey: string}) {
    const [platform, setPlatform] = useState('')
    const [uri, setURI] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [avaliation, setAvaliation] = useState<number>(0)

    const [showPassword, setShowPassword] = useState(false)
    const navigation = useNavigation<StackNavigationProp<any>>()
  
    const handleSave = async () => {
        if(platform != '' && uri != '' && username != '' && password != '') {

            const encryptionKey = isElderlyCredential ? deriveSecret([await getKey(userId), auxKey]) : auxKey

            await addCredencial(userId, encryptionKey, getNewId(), JSON.stringify({platform: platform, uri: uri, username: username, password: password}), isElderlyCredential)
            navigation.goBack()
        }
    }

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const regeneratePassword = () => {
        const password = Algorithm({length: 15, strict: true, symbols: true, uppercase: true, lowercase: true, numbers: true})
        setPassword(password)
    }

    useEffect(() => setAvaliation(getScore(password)), [password])

    useEffect(() => regeneratePassword(), [])

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
                            placeholder={placeholderPassword}
                            value={password}
                            style={{ flex: 1, fontSize: 22, marginRight: '5%', padding: '3%'}}
                            secureTextEntry={!showPassword}
                            onChangeText={text => setPassword(text)}
                            />
                            <AvaliationEmoji avaliation={avaliation}/>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', margin: '5%'}}>
                        <TouchableOpacity style={[{flex: 0.35, marginRight: '2%', flexDirection: 'row'}, passwordFirstHalf.copyButton, stylesButtons.mainConfig]}  onPress={toggleShowPassword} >
                            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={35} color="black"/> 
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.65, marginLeft: '2%'}, passwordFirstHalf.regenerateButton, stylesButtons.mainConfig]} onPress={() => {regeneratePassword()} }>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 22, fontWeight: 'bold', margin: '5%' }]}>Regenerar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={[{flex: 0.1, marginHorizontal: '10%', marginVertical: '2%'}, stylesAddCredential.button, stylesButtons.mainConfig]} onPress={() => handleSave()}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '3%'}, stylesAddCredential.buttonText]}>ADICIONAR</Text>
            </TouchableOpacity>
        </View>
    )
}

function AddCredencial({ route }: Readonly<{route: any}>) {
    console.log(route.params.key)
    return (
        <>
        <KeyboardAvoidingWrapper>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainBox text="Adicionar credencial"/>
                <CredentialsInput userId={route.params.userId} key={route.params.key} isElderlyCredential={route.params.isElderlyCredential} auxKey={route.params.key} />
            </View>
        </KeyboardAvoidingWrapper>
        <Navbar/>
        </>
    )
}
  

export { AddCredencial }