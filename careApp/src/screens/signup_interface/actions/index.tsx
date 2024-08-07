import React, { useState } from "react"
import { View, TextInput, Text, TouchableOpacity } from "react-native"
import { styles, actions } from "../styles/styles";
import { color8, darkGrey, placeholderColor, signUpButtonTextColor } from "../../../assets/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stylesButtons } from "../../../assets/styles/main_style";
import { Spinner } from "../../../components/LoadingComponents";
import { useSessionInfo } from "../../../context/session";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import { signUpOperation } from "../../../firebase/authentication/funcionalities";
import { appName, createAccountLabel, createAccountSlimLabel, emailLabel, emailPlaceholder, emptyValue, mobileLabel, mobilePlaceholder, nameLabel, namePlaceholder, pageSignupTitle, passwordLabel, passwordPlaceholder, visibilityOffLabel, visibilityOnLabel } from "../../../assets/constants/constants";
import  { NavbarJustBack } from "../../../navigation/actions";
import { mainBoxTextSize, signInUpDescriptionTextSize, signinUpInputTextSize, buttonNormalTextSize } from "../../../assets/styles/text";

export function SignUp () {

    const [email, setEmail] = useState(emptyValue)
    const [password, setPassword] = useState(emptyValue)
    const [name, setName] = useState(emptyValue)
    const [phoneNumber, setPhoneNumber] = useState(emptyValue)

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(true)

    const toggleShowPassword = () => {setShowPassword(!showPassword)}
    const { setUserEmail, setUserPhone, setUserName } = useSessionInfo()

    const signUp = async () => {
        setLoading(true)
        signUpOperation(email, password).then((loginResult) => {
            if(loginResult) {
                setUserPhone(phoneNumber)
                setUserName(name) 
                setUserEmail(email)
            } else {
                setLoading(false)
            }
        })
    }
    
    return (        
        <View style={[styles.container]}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text adjustsFontSizeToFit style={{fontSize: mainBoxTextSize, margin: '3%', color: darkGrey}}>
                    {pageSignupTitle}
                </Text>
            </View>
            <View style={{}}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '5%', marginLeft: '5%', justifyContent: 'center', fontSize: signInUpDescriptionTextSize, color: darkGrey}]}>{nameLabel}</Text>
                <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: color8 }]}>
                    <TextInput
                    placeholder={namePlaceholder}
                    placeholderTextColor={placeholderColor}
                    value={name}
                    autoFocus={true} 
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: signinUpInputTextSize, padding: '3%', marginHorizontal: '5%', marginVertical: '1%', color: darkGrey }}
                    onChangeText={setName}
                    maxLength={36}
                    />
                </View> 
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: signInUpDescriptionTextSize, color: darkGrey}]}>{emailLabel}</Text>
                <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: color8 }]}>
                    <TextInput
                    placeholder={emailPlaceholder}
                    placeholderTextColor={placeholderColor}
                    value={email}
                    autoFocus={true} 
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: signinUpInputTextSize, padding: '3%', marginHorizontal: '5%', marginVertical: '1%', color: darkGrey }}
                    onChangeText={setEmail}
                    />
                </View> 
                <Text numberOfLines={1} adjustsFontSizeToFit style={[{marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: signInUpDescriptionTextSize, color: darkGrey}]}>{mobileLabel}</Text>
                <View style={[{margin: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: color8 }]}>
                    <TextInput
                    placeholder={mobilePlaceholder}
                    placeholderTextColor={placeholderColor}
                    value={phoneNumber}
                    autoFocus={true} 
                    autoCapitalize='none'
                    style={{ flex: 1, fontSize: signinUpInputTextSize, padding: '3%', marginHorizontal: '5%', marginVertical: '1%', color: darkGrey }}
                    onChangeText={setPhoneNumber}
                    />
                </View>
                { loading ? <Spinner width={300} height={300}/>
                : 
                <>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{ marginTop: '3%', marginLeft: '5%', justifyContent: 'center', fontSize: signInUpDescriptionTextSize, color: darkGrey }]}>{passwordLabel}</Text>
                    <View style={[{ marginTop: '3%', marginHorizontal: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, { borderRadius: 15, borderWidth: 2, backgroundColor: color8 }]}>
                        <TextInput
                            placeholder={passwordPlaceholder}
                            placeholderTextColor={placeholderColor}
                            value={password}
                            autoFocus={true}
                            secureTextEntry={showPassword}
                            autoCapitalize='none'
                            style={{ flex: 1, fontSize: signinUpInputTextSize, padding: '3%', marginHorizontal: '5%', marginVertical: '1%', color: darkGrey }}
                            onChangeText={setPassword} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                    <View style={{}}>
                        <TouchableOpacity style={[{  marginVertical: '5%', marginHorizontal: '10%' }, stylesButtons.mainConfig, actions.sinUpButton]} onPress={signUp}>
                            <Text style={{ fontSize: buttonNormalTextSize, marginVertical: '5%', fontWeight: 'bold', color: signUpButtonTextColor }}>{createAccountSlimLabel}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
            </View>
        </View>
    )
}

export default function SignUpPage() {
    return (
        <>
            <KeyboardAvoidingWrapper>
                <SignUp/>
            </KeyboardAvoidingWrapper>
            <NavbarJustBack/>
        </>
    )
}