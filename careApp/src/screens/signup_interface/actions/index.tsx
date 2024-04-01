import React, { useEffect, useState } from "react"
import { View, TextInput, Text, TouchableOpacity } from "react-native"
import { styles, actions } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stylesButtons } from "../../../assets/styles/main_style";
import { Spinner } from "../../../components/LoadingComponents";
import { useSessionInfo } from "../../../firebase/authentication/session";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import { signUpOperation } from "../../../firebase/authentication/funcionalities";
import { appName, createAccountLabel, emailLabel, emailPlaceholder, mobileLabel, mobilePlaceholder, nameLabel, namePlaceholder, passwordLabelBig, passwordPlaceholder } from "../../../assets/constants";

const SignUpPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(true)

    const toggleShowPassword = () => {setShowPassword(!showPassword)}
    const { setUserEmail, setUserPhone, setUserName } = useSessionInfo()

    useEffect(() => console.debug("===> Signup_Page: Component presented.\n"), [])

    const signUp = async () => {
        setLoading(true)
        signUpOperation(email, password).then((loginResult) => {
            setLoading(false)
            if(loginResult) {
                setUserPhone(phoneNumber)
                setUserName(name)
                setUserEmail(email)
                //navigation.push('Home')
            }
        })
    }
    return (        
            <KeyboardAvoidingWrapper >
                <View style={[{flex: 1}, styles.container]}>
                    <View style={{flex: 0.20, alignItems: 'center', justifyContent: 'center', marginTop: '10%'}}>
                        <Text style={{fontSize: 50}}>
                            {appName}
                        </Text>
                    </View>
                    <View style={{flex: 0.4}}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '5%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{nameLabel}</Text>
                        <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder={namePlaceholder}
                            value={name}
                            autoFocus={true} 
                            autoCapitalize="none"
                            style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                            onChangeText={setName}
                            maxLength={36}
                            />
                        </View> 
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{emailLabel}</Text>
                        <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder={emailPlaceholder}
                            value={email}
                            autoFocus={true} 
                            autoCapitalize="none"
                            style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                            onChangeText={setEmail}
                            />
                        </View> 
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20}]}>{mobileLabel}</Text>
                        <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                            placeholder={mobilePlaceholder}
                            value={phoneNumber}
                            autoFocus={true} 
                            autoCapitalize='none'
                            style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                            onChangeText={setPhoneNumber}
                            />
                        </View>
                        { loading ? <Spinner width={300} height={300}/>
                        : 
                        <><Text numberOfLines={1} adjustsFontSizeToFit style={[{ marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: 20 }]}>{passwordLabelBig}</Text><View style={[{ marginTop: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                            <TextInput
                                placeholder={passwordPlaceholder}
                                value={password}
                                autoFocus={true}
                                secureTextEntry={showPassword}
                                autoCapitalize='none'
                                style={{ flex: 1, fontSize: 18, padding: '3%', marginHorizontal: '5%', marginVertical: '1%' }}
                                onChangeText={setPassword} />
                        </View><View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={[{ flex: 0.22, marginHorizontal: '4%', marginTop: '2%' }, stylesButtons.mainConfig, stylesButtons.copyButton]} onPress={toggleShowPassword}>
                                    <MaterialCommunityIcons style={{ marginHorizontal: '5%' }} name={showPassword ? 'eye' : 'eye-off'} size={40} color="black" />
                                </TouchableOpacity>
                            </View><View style={{ flex: 0.4 }}>
                                <TouchableOpacity style={[{ flex: 0.4, width: '80%', marginVertical: '5%', marginHorizontal: '10%' }, stylesButtons.mainConfig, stylesButtons.copyButton, actions.sinUpButton]} onPress={signUp}>
                                    <Text style={{ fontSize: 30, marginVertical: '5%' }}>{createAccountLabel}</Text>
                                </TouchableOpacity>
                            </View></>
                    }
                    </View>
                </View>
            </KeyboardAvoidingWrapper>
    )
}

export default SignUpPage