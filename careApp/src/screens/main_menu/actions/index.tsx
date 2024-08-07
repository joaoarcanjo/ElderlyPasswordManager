import {View, Text, Image, TouchableOpacity} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { stylesOptions, stylesFirstHalf } from '../styles/sytles'
import { stylesButtons } from '../../../assets/styles/main_style'
import { useSessionInfo } from '../../../context/session'
import { getKeychainValueFor, saveKeychainValue } from '../../../keychain'
import { caregiverFireKey, caregiverName, caregiverPhone } from '../../../keychain/constants'
import { createIdentity } from '../../../e2e/identity/functions'
import { credentialTimoutRefresh, credentialsLabel, elderlyLabel, emptyValue, generatorLabel, heyLabel, pageCredentials, pageElderlyList, pageQuestions, pageGenerator, pageSettings, questionsLabel, settingsLabel } from '../../../assets/constants/constants'
import { getAllCredentialsAndValidate } from '../../list_credentials/actions/functions'
import SplashScreen from '../../splash_screen/actions'
import { flashTimeoutPromise } from '../../splash_screen/actions/functions'
import * as SplashFunctions from 'expo-splash-screen';
import { localDBKey as localDBKeyLabel } from '../../../keychain/constants';

const credentialsImage = '../../../assets/images/credenciais.png'
const generatorImage = '../../../assets/images/gerador.png'
const settingsImage = '../../../assets/images/definições.png'
const questionsImage = '../../../assets/images/perguntas.png'
const caregiverImage = '../../../assets/images/caregiver.png'
const elderlyImage = '../../../assets/images/healthcare.png'


function CaregiverInfoBox() {

    const { userName } = useSessionInfo()

    return (
        <View style={[{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }, stylesFirstHalf.elderlyContainer]}>
            <View style={{flex: 0.55}}>
                <View style={{flex: 0.50, justifyContent: 'center'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 25, fontWeight: 'bold', marginLeft: '10%'}}>{heyLabel}</Text>
                </View>
                <View style={{flex: 0.50, marginLeft: '10%'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit  style={{fontSize: 35, fontWeight: 'bold'}}>{userName}</Text>
                </View>
            </View>
            <View style={{flex: 0.45, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require(caregiverImage)} style={{ width: '80%', height: '80%', resizeMode: 'contain'}}/>
            </View>
        </View>
    )
}

function Functionalities() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const ElderlyNavigation = () => {
        navigation.push(pageElderlyList)
    }

    const CredentialsNavigation = async () => {
        navigation.push(pageCredentials)
    }

    const GeneratorsNavigation = () => {
        navigation.push(pageGenerator)
    }

    const FrequentQuestionsNavigation = () => {
        navigation.push(pageQuestions)
    }

    const SettingsNavigation = () => {
        navigation.push(pageSettings)
    }

    return (
        <View style={{flex: 0.80, marginVertical: '6%', justifyContent: 'center', alignItems: 'center'}}>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareCredentials, stylesButtons.mainConfig]} onPress={() => CredentialsNavigation()}>
                    <Image source={require(credentialsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{credentialsLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareGenerator, stylesButtons.mainConfig]} onPress={() => GeneratorsNavigation()}>
                    <Image source={require(generatorImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{generatorLabel}</Text>
                </TouchableOpacity>
           </View>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareSettings, stylesButtons.mainConfig]} onPress={() => SettingsNavigation()}>
                    <Image source={require(settingsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{settingsLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareQuestions, stylesButtons.mainConfig]} onPress={() => {ElderlyNavigation()}}>
                    <Image source={require(elderlyImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={[stylesOptions.squareText]}>{elderlyLabel}</Text>
                </TouchableOpacity>
           </View>
           <View style={[{flex: 0.25, marginVertical: '2%', width: '90%'}]} >
                <TouchableOpacity style={[{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}, stylesFirstHalf.elderlyButton, stylesButtons.mainConfig]} onPress={() => FrequentQuestionsNavigation()}>
                    <Image source={require(questionsImage)} style={[stylesOptions.helpPhoto]}/>
                    <Text style={[{marginLeft: '7%'}, stylesFirstHalf.elderlButtonText]}>{questionsLabel}</Text>
                </TouchableOpacity>
            </View>
           {/*<Button title='DELETE DATABASE CREDENTIALS' onPress={() => deleteAllCredentialFromLocalDB()}></Button>*/}
        </View>
    );
}

/**
 * Quando o componente do menu principal é renderizado, é atualizado os dados do user.
 * @returns 
 */
export default function MainMenu() {

    const { userId, setUserName, setUserPhone, userPhone, userName, userEmail, localDBKey, setLocalDBKey } = useSessionInfo()
    const [appIsReady, setAppIsReady] = useState(true)
    //const { expoPushToken } = usePushNotifications()
    
    useEffect(() => {
        
        if(userId == emptyValue) return
        
        const interval = setInterval(async () => {
            if(localDBKey == '') {
                setLocalDBKey(await getKeychainValueFor(localDBKeyLabel(userId)))
            }
            await getAllCredentialsAndValidate(userId, await getKeychainValueFor(caregiverFireKey(userId)), localDBKey)
        }, credentialTimoutRefresh) 

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        savePhoneAndName()
        identityCreation()
        flashTimeoutPromise(userId, setAppIsReady, setLocalDBKey)
        .then(() => setAppIsReady(true))
    }, [])
    
    const savePhoneAndName = async () => {
        if(userPhone == emptyValue && userName == emptyValue && userId != emptyValue) {
            const userNameAux = await getKeychainValueFor(caregiverName(userId))
            const userPhoneAux = await getKeychainValueFor(caregiverPhone(userId))

            if(userNameAux != emptyValue && userPhoneAux != emptyValue) {
                setUserName(userNameAux)
                setUserPhone(userPhoneAux)
            }
        } else if (userId != emptyValue) {
            await saveKeychainValue(caregiverName(userId), userName)
            await saveKeychainValue(caregiverPhone(userId), userPhone)
        }
    }
    
    const identityCreation = async () => {
        await createIdentity(userId, userEmail)
    }

    savePhoneAndName()

    const onLayoutRootView = useCallback(async () => { if (!appIsReady) await SplashFunctions.hideAsync() }, [appIsReady])

    if (!appIsReady) return <SplashScreen layout={onLayoutRootView} />
    return (
        <View style={{ flex: 1, flexDirection: 'column', marginTop: '5%'}}>
            <CaregiverInfoBox/>
            <Functionalities/>
        </View>
    );
}