import React, { useEffect, useState } from "react"
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { signInOperation } from "../../../firebase/authentication/funcionalities";
import { caregiverEmail, caregiverPwd } from "../../../keychain/constants";
import { styles, actions } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stylesButtons } from "../../../assets/styles/main_style";
import { Spinner } from "../../../components/LoadingComponents";
import { useSessionInfo } from "../../../context/session";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import { getKeychainValueFor } from "../../../keychain";
import { appName, createAccountLabel, doesNotHaveAccountLabel, emailLabel, emailPlaceholder, emptyValue, enterLabel, pageSignup, passwordLabel, passwordPlaceholder } from "../../../assets/constants/constants";

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
        console.debug("===> SignIn_Page: Component presented.\n")
        setLoadingPersistent(true)
        persistentLogin()
    }, [])

    async function persistentLogin() {
        const pwdSaved = await getKeychainValueFor(caregiverPwd)
        const emailSaved = await getKeychainValueFor(caregiverEmail)

        if(emailSaved != emptyValue && pwdSaved != emptyValue) {
            signInOperation(emailSaved, pwdSaved).then(async (loginResult) => {
                if(loginResult) {
                    setLoadingPersistent(false)
                    setUserEmail(emailSaved)
                } else {
                    setEmail(emailSaved)
                    setPassword(pwdSaved)
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
        signInOperation(email, password).then(async () => setLoading(false))
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
                        <Text style={{fontSize: 50}}>
                            {appName}
                        </Text>
                    </View>
                    <View style={{flex: 0.4}}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{emailLabel}</Text>
                        <View style={[{margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder={emailPlaceholder}
                            value={email}
                            autoFocus={true} 
                            autoCapitalize="none"
                            style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '2%' }}
                            onChangeText={setEmail}
                            />
                        </View> 
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{passwordLabel}</Text>
                        <View style={[{marginTop: '4%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder={passwordPlaceholder}
                            value={password}
                            autoFocus={true} 
                            secureTextEntry={showPassword}
                            autoCapitalize='none'
                            style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '2%' }}
                            onChangeText={setPassword}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TouchableOpacity style={[{flex: 0.22, marginHorizontal: '4%', marginTop: '2%'}, stylesButtons.mainConfig, stylesButtons.visibilityButton]}  onPress={toggleShowPassword} >
                                <MaterialCommunityIcons style={{marginHorizontal: '5%'}} name={showPassword ? 'eye' : 'eye-off'} size={40} color="black"/> 
                            </TouchableOpacity>  
                        </View> 
                    </View>
                    <View style={{flex: 0.4}}>
                        { loading ? <Spinner width={300} height={300}/>
                         : 
                            <>
                            <TouchableOpacity style={[{flex: 0.6, width: '80%', marginBottom: '5%', marginHorizontal: '10%', marginTop: '5%'}, stylesButtons.mainConfig, actions.signInButton]} onPress={signIn}>
                                <Text style={{fontSize: 30, marginVertical: '5%'}}>{enterLabel}</Text>
                            </TouchableOpacity>
                            <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginHorizontal: '3%' }}/>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginLeft: '10%', marginBottom: '2%', marginTop: '10%', justifyContent: 'center', fontSize: 20}]}>{doesNotHaveAccountLabel}</Text>
                            <TouchableOpacity style={[{flex: 0.4, width: '80%', marginBottom: '5%', marginHorizontal: '10%'}, stylesButtons.mainConfig, actions.sinUpButton]} onPress={signUp}>
                                <Text style={{fontSize: 30, marginVertical: '5%'}}>{createAccountLabel}</Text>
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