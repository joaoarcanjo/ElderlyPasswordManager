import React, { useEffect, useState } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { stylesButtons } from "../../../assets/styles/main_style";
import { passwordFirstHalf, stylesAddCredential, stylesInputsCredencials } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import Navbar from "../../../navigation/actions";
import { addCredencial } from "../../../firebase/firestore/funcionalities";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Algorithm from "../../password_generator/actions/algorithm";
import { getScore } from '../../../algorithms/zxcvbn/algorithm'
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import MainBox from "../../../components/MainBox";
import AvaliationEmoji from "../../../components/EmojiAvaliation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getNewId } from "../../../algorithms/0thers/cryptoOperations";

const placeholderPlatform = 'Insira a plataforma'
const placeholderUsername = 'Insira o seu username'
const placeholderPassword = "Insira a password"

function CredentialsInput() {

    const [platform, setPlatform] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avaliation, setAvaliation] = useState<number>(0)

    const [showPassword, setShowPassword] = useState(false); 
    const navigation = useNavigation<StackNavigationProp<any>>();
  
    const handleSave = () => {
        if(platform != '' && username != '' && password != '') {
            const uuid = getNewId()
            addCredencial(uuid, JSON.stringify({platform: platform, username: username, password: password}))
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
            <View style={{flex: 0.9, width: '100%', flexDirection: 'row'}}>
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '5%'}, stylesInputsCredencials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Platform</Text>
                    <View style={[{margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderPlatform}
                        value={platform}
                        autoFocus={true}
                        style={{ flex: 1, fontSize: 22, padding: '3%', marginHorizontal: '5%' }}
                        onChangeText={text => setPlatform(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Username</Text>
                    <View style={[{margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder={placeholderUsername}
                        value={username}
                        autoCapitalize='none'
                        style={{ flex: 1, fontSize: 22, padding: '3%', marginHorizontal: '5%' }}
                        onChangeText={text => setUsername(text)}
                        />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Password</Text>
                    <View style={[{margin: '4%'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
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

function AddCredencial() {
    return (
        <>
        <KeyboardAvoidingWrapper>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainBox text="Adicionar credencial"/>
                <CredentialsInput />
            </View>
        </KeyboardAvoidingWrapper>
        <Navbar/>
        </>
    )
}
  

export { AddCredencial }