import {View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { stylesOptions, stylesFirstHalf } from '../styles/sytles'
import { stylesButtons } from '../../../assets/styles/main_style'
import { createIdentity } from '../../../e2e/identity/functions'

const generatorImage = '../images/gerador.png'
const settingsImage = '../images/definições.png'
const questionsImage = '../images/perguntas.png'
const elderlyImage = '../images/elderly.png'


function ElderlyInfoBox() {

    const userName = "José Augusto"

    return (
        <View style={[{ flex: 0.6, width: '85%', flexDirection: 'row', justifyContent: 'space-around' }, stylesFirstHalf.caregiverContainer]}>
            <View style={{flex: 0.55}}>
                <View style={{flex: 0.50, justifyContent: 'center'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 25, fontWeight: 'bold', marginLeft: '10%'}}>Olá,</Text>
                </View>
                <View style={{flex: 0.50, marginLeft: '10%'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit  style={{fontSize: 35, fontWeight: 'bold'}}>{userName}</Text>
                </View>
            </View>
            <View style={{flex: 0.45, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require(elderlyImage)} style={{ width: '80%', height: '80%', resizeMode: 'contain'}}/>
            </View>
        </View>
    )
}

function CaregiversButtonBox() {

    const navigation = useNavigation<StackNavigationProp<any>>();
    //navigation.push('Caregivers')
    const GeneratorsNavigation = () => {
        //navigation.push('Caregivers')
    }

    return (
        <View style={[{flex: 0.3}, stylesFirstHalf.numberOfElderlyContainer]}>
             <Text style={stylesFirstHalf.caregiversButtonText}>Número de idosos: 4</Text>
        </View>
    )
}

function UserInfo() {
    
    return (
        <View style={{ flex: 0.35, justifyContent: 'center', alignItems: 'center'}}>
            <ElderlyInfoBox/>
            <CaregiversButtonBox/>
        </View>
    );
}

function Functionalities() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const CredencialsNavigation = async () => {
        // Your code to handle the click event
        //console.log('Credentials button clicked!');
        await createIdentity('care@g.com') //TODO: não ficará aqui, por agora apenas para teste.
        navigation.push('ElderlyList')
    }

    const GeneratorsNavigation = () => {
        // Your code to handle the click event
        //console.log('Generator button clicked!');
        //navigation.push('Generator')
    }

    const FrequentQuestionsNavigation = () => {
        // Your code to handle the click event
        //console.log('Questions button clicked!');
        //navigation.push('FrequentQuestions')
    }

    const SettingsNavigation = () => {
        // Your code to handle the click event
        //console.log('Questions button clicked!');
        //navigation.push('Settings')
    }

    return (
        <View style={{flex: 0.65, marginTop: '10%', marginBottom: '10%', justifyContent: 'center', alignItems: 'center' }}>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareCredentials, stylesButtons.mainConfig]} onPress={() => CredencialsNavigation()}>
                    <Image source={require(elderlyImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Idosos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareGenerator, stylesButtons.mainConfig]} onPress={() => GeneratorsNavigation()}>
                    <Image source={require(generatorImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '0%'}, stylesOptions.squareText]}>Gerar nova</Text>
                </TouchableOpacity>
           </View>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareSettings, stylesButtons.mainConfig]} onPress={() => SettingsNavigation()}>
                    <Image source={require(settingsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Definições</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%'}, stylesOptions.squareQuestions, stylesButtons.mainConfig]} onPress={() => FrequentQuestionsNavigation()}>
                    <Image source={require(questionsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Perguntas</Text>
                </TouchableOpacity>
           </View>
        </View>
    );
}

/**
 * Quando o componente do menu principal é renderizado, é atualizado os dados do user.
 * @returns 
 */
export default function MainMenu() {

    return (
        <View style={{ flex: 1, flexDirection: 'column', marginTop: '5%'}}>
            <UserInfo/>
            <Functionalities/>
        </View>
    );
}