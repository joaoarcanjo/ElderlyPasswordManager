import React, { useEffect, useState } from "react"
import { View, TextInput, Image, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { signInOperation, signUpOperation } from "../../../firebase/authentication/funcionalities";
import { getValueFor } from "../../../keychain";
import { elderlyEmail, elderlyPwd } from "../../../keychain/constants";
import { styles, actions } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stylesButtons } from "../../../assets/styles/main_style";
import { Spinner } from "../../../components/Spinner";
import { useLogin } from "./session";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";

const LoginPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingPersistent, setLoadingPersistent] = useState(false)
    const [showPassword, setShowPassword] = useState(false); 

    const navigation = useNavigation<StackNavigationProp<any>>()
    const toggleShowPassword = () => {setShowPassword(!showPassword);}
    const { setUserEmail, setUserPhone, setUserName } = useLogin()

    useEffect(() => {
        setLoadingPersistent(true)
        persistentLogin()
    }, [])

    async function persistentLogin() {
        const pwdSaved = await getValueFor(elderlyPwd)
        const emailSaved = await getValueFor(elderlyEmail)

        if(emailSaved != '' && pwdSaved != '') {
            signInOperation(emailSaved, pwdSaved).then((loginResult) => {
                if(loginResult) {
                    setLoadingPersistent(false)
                    setUserEmail(emailSaved)

                    setUserPhone("966666666") //TODO: Para tirar daqui
                    setUserName("User name") //TODO: Para tirar daqui
                    navigation.navigate('Home')
                }
            })
        } else {
            if(emailSaved != '') {
                setEmail(emailSaved)
            }
            setLoadingPersistent(false)
        }
    }

    const signIn = async () => {
        setLoading(true)

        const emailSaved = await getValueFor(elderlyEmail)

        if (emailSaved != '' && email != emailSaved) {
            console.log("Email inválido")
            setLoading(false)
        } else {
            signInOperation(email, password).then((loginResult) => {
                setLoading(false)
                if(loginResult) {
                    setUserPhone("966666666") //TODO: Para tirar daqui
                    setUserName("User name") //TODO: Para tirar daqui
                    navigation.push('Home')
                } 
            })
        }
    }

    const signUp = async () => {
        setLoading(true)
        signUpOperation(email, password).then((loginResult) => {
            setLoading(false)
            if(loginResult) {
                navigation.push('Home')
            }
        })
    }

    return (        
            <>
                { loadingPersistent ? 
                <View style={[{flex: 1, alignItems: 'center',justifyContent: 'center'}, styles.container]}>
                    <Image source={require('../../../assets/images/spinner6.gif')} style={[{width: 300, height: 300, resizeMode: 'contain'}]}/>
                </View>
                :
                <KeyboardAvoidingWrapper >
                    <View style={[{flex: 1}, styles.container]}>
                    <View style={{flex: 0.20, alignItems: 'center', justifyContent: 'center', marginTop: '10%'}}>
                        <Text style={{fontSize: 50}}>
                            ElderAPP
                        </Text>
                    </View>
                    <View style={{flex: 0.4}}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>EMAIL</Text>
                        <View style={[{margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder="Email"
                            value={email}
                            autoFocus={true} 
                            autoCapitalize="none"
                            style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '2%' }}
                            onChangeText={setEmail}
                            />
                        </View> 
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>PASSWORD</Text>
                        <View style={[{marginTop: '4%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder="Password"
                            value={password}
                            autoFocus={true} 
                            secureTextEntry={showPassword}
                            autoCapitalize='none'
                            style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '2%' }}
                            onChangeText={setPassword}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TouchableOpacity style={[{flex: 0.22, marginHorizontal: '4%', marginTop: '2%'}, stylesButtons.mainConfig, stylesButtons.copyButton]}  onPress={toggleShowPassword} >
                                <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={showPassword ? 'eye' : 'eye-off'} size={40} color="black"/> 
                            </TouchableOpacity>  
                        </View> 
                    </View>
                    <View style={{flex: 0.4}}>
                        { loading ? 
                        <Spinner/> : 
                            <>
                            <TouchableOpacity style={[{flex: 0.6, width: '80%', marginBottom: '15%', margin: '10%'}, stylesButtons.mainConfig, stylesButtons.copyButton, actions.signInButton]} onPress={signIn}>
                                <Text style={{fontSize: 30, marginVertical: '5%'}}>Entrar</Text>
                            </TouchableOpacity>
                            <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, margin: '3%' }}/>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '10%', marginBottom: '2%', marginTop: '10%', justifyContent: 'center', fontSize: 20}]}>Ainda não tem conta?</Text>
                            <TouchableOpacity style={[{flex: 0.4, width: '80%', marginBottom: '10%', marginHorizontal: '10%'}, stylesButtons.mainConfig, stylesButtons.copyButton, actions.sinUpButton]} onPress={signUp}>
                                <Text style={{fontSize: 30, marginVertical: '5%'}}>Criar uma conta</Text>
                            </TouchableOpacity>
                            </>
                        }
                    </View>
                    </View>
                </KeyboardAvoidingWrapper>
            }
            </>
    )
}

export default LoginPage