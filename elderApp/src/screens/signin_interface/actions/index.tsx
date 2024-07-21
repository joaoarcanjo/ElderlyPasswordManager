import React, { useEffect, useState } from "react"
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { signInOperation } from "../../../firebase/authentication/funcionalities";
import { getKeychainValueFor } from "../../../keychain";
import { elderlyEmail, elderlyPwd } from "../../../keychain/constants";
import { styles, actions } from "../styles/styles";
import { signInButtonTextColor, signUpButtonTextColor, color8, darkGrey, placeholderColor } from "../../../assets/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stylesButtons } from "../../../assets/styles/main_style";
import { Spinner } from "../../../components/LoadingComponents";
import { useSessionInfo } from "../../../context/session";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import { createAccountLabel, doesNotHaveAccountLabel, emailLabel, emailPlaceholder, emptyValue, enterLabel, pageLoginTitle, pageSignup, passwordLabel, passwordPlaceholder, visibilityOffLabel, visibilityOnLabel } from "../../../assets/constants/constants";
import { buttonNormalTextSize, mainBoxTextSize, signInUpDescriptionTextSize, signinUpInputTextSize } from "../../../assets/styles/text";

const SignInPage = () => {

    const [email, setEmail] = useState(emptyValue)
    const [password, setPassword] = useState(emptyValue)
    const [loading, setLoading] = useState(false)
    const [loadingPersistent, setLoadingPersistent] = useState(false)
    const [showPassword, setShowPassword] = useState(true)

    const navigation = useNavigation<StackNavigationProp<any>>()
    const toggleShowPassword = () => {setShowPassword(!showPassword);}
    const { setUserEmail } = useSessionInfo()

    useEffect(() => {
        console.log("===> SignIn_Page: Component presented.\n")
        setLoadingPersistent(true)
        persistentLogin()
    }, [])

    async function persistentLogin() {
        const pwdSaved = await getKeychainValueFor(elderlyPwd)
        const emailSaved = await getKeychainValueFor(elderlyEmail)

        if(emailSaved != emptyValue && pwdSaved != emptyValue) {
            signInOperation(emailSaved, pwdSaved, setLoading).then(async (loginResult) => {
                if(loginResult) {
                    setLoadingPersistent(false)
                    setUserEmail(emailSaved)
                    //navigation.push('InsideLayout')
                } else {
                    setEmail(emailSaved)
                    setPassword(emptyValue)
                    setLoadingPersistent(false)
                }
            })
        } else {
            setLoadingPersistent(false)
            if(emailSaved != emptyValue) {
                setEmail(emailSaved)
            }
        }
    }

    const signIn = async () => {
        setLoading(true)
        const startTime = Date.now()    
        signInOperation(email, password, setLoading)
        .then(() => {
            const endTime = Date.now()
            const duration = endTime - startTime;
            //Alert.alert('Tempo de execução de entrar numa conta:', `${duration}ms`)
        })
    }

    const signUp = async () => {
        navigation.navigate(pageSignup)
    }

    return (        
            <>
                { loadingPersistent ? 
                <View style={[{flex: 1, alignItems: 'center',justifyContent: 'center'}, styles.container]}>
                    <Spinner width={300} height={300}/>
                </View>
                :
                <KeyboardAvoidingWrapper >
                    <View style={[{flex: 1}, styles.container]}>
                        <View style={{flex: 0.20, alignItems: 'center', justifyContent: 'center', marginTop: '10%'}}>
                            <Text  adjustsFontSizeToFit style={{fontSize: mainBoxTextSize, margin: '3%', color: darkGrey}}>
                                {pageLoginTitle}
                            </Text>
                        </View>
                        <View style={{flex: 0.4}}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: signInUpDescriptionTextSize, color: darkGrey}]}>{emailLabel}</Text>
                            <View style={[{margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: color8 }]}>
                                <TextInput
                                placeholder={emailPlaceholder}
                                placeholderTextColor={placeholderColor}
                                value={email}
                                autoFocus={true} 
                                autoCapitalize="none"
                                style={{ flex: 1, fontSize: signinUpInputTextSize, padding: '3%', marginHorizontal: '5%', marginVertical: '2%', color: darkGrey }}
                                onChangeText={setEmail}
                                />
                            </View> 
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: signInUpDescriptionTextSize, color: darkGrey}]}>{passwordLabel}</Text>
                            <View style={[{marginTop: '4%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: color8 }]}>
                                <TextInput
                                placeholder={passwordPlaceholder}
                                placeholderTextColor={placeholderColor}
                                value={password}
                                autoFocus={true} 
                                secureTextEntry={showPassword}
                                autoCapitalize='none'
                                style={{ flex: 1, fontSize: signinUpInputTextSize, padding: '3%', marginHorizontal: '5%', marginVertical: '2%', color: darkGrey }}
                                onChangeText={setPassword}
                                />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                {showPassword ?
                                <TouchableOpacity style={[{flex: 0.22, marginHorizontal: '4%', marginTop: '2%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowPassword} >
                                    <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye'} size={34} color={darkGrey}/> 
                                    <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOnLabel}</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={[{flex: 0.22, marginHorizontal: '4%', marginTop: '2%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]} onPress={toggleShowPassword} >
                                    <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={'eye-off'} size={34} color={darkGrey}/> 
                                    <Text style={{marginHorizontal: '2%', fontWeight: 'bold', color: darkGrey}}>{visibilityOffLabel}</Text>
                                </TouchableOpacity>  
                                }
                            </View> 
                        </View>
                        <View style={{flex: 0.4}}>
                            { loading ? <Spinner width={300} height={300}/>
                            : 
                                <>
                                <TouchableOpacity style={[{flex: 0.6, width: '80%', marginBottom: '5%', marginHorizontal: '10%', marginTop: '5%'}, stylesButtons.mainConfig, actions.signInButton]} onPress={signIn}>
                                    <Text style={{fontSize: buttonNormalTextSize, marginVertical: '5%', fontWeight: 'bold', color: signInButtonTextColor}}>{enterLabel}</Text>
                                </TouchableOpacity>
                                <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: '3%' }}/>
                                <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '10%', marginBottom: '2%', marginTop: '10%', justifyContent: 'center', fontSize: signInUpDescriptionTextSize}]}>{doesNotHaveAccountLabel}</Text>
                                <TouchableOpacity style={[{flex: 0.4, width: '80%', marginBottom: '5%', marginHorizontal: '10%'}, stylesButtons.mainConfig, actions.sinUpButton]} onPress={signUp}>
                                    <Text style={{ fontSize: buttonNormalTextSize, marginVertical: '5%', fontWeight: 'bold', color: signUpButtonTextColor }}>{createAccountLabel}</Text>
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

export default SignInPage