import {View, Text, Image, TouchableOpacity} from 'react-native'
import { stylesOptions, stylesFirstHalf } from '../styles/styles'
import React = require('react')

const credentialsImage = '../images/credenciais.png'
const generatorImage = '../images/gerador.png'
const settingsImage = '../images/definições.png'
const questionsImage = '../images/perguntas.png'
const elderlyImage = '../../../assets/images/elderly.png'


function ElderlyInfoBox() {
    return (
        <View style={[{ flex: 0.6, width: '85%', flexDirection: 'row', justifyContent: 'space-around' }, stylesFirstHalf.elderContainer]}>
            <View style={{flex: 0.55}}>
                <View style={{flex: 0.50, justifyContent: 'center'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 25, fontWeight: 'bold', marginLeft: '10%'}}>Olá,</Text>
                </View>
                <View style={{flex: 0.50, marginLeft: '10%'}}>
                    <Text numberOfLines={1} adjustsFontSizeToFit  style={{fontSize: 35, fontWeight: 'bold'}}>Manuel A.</Text>
                </View>
            </View>
            <View style={{flex: 0.45, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require(elderlyImage)} style={{ width: '80%', height: '80%', resizeMode: 'contain'}}/>
            </View>
        </View>
    )
}

function CaregiversButtonBox() {
    return (
        <View style={[{flex: 0.4}, stylesFirstHalf.caregiversContainer]}>
            <TouchableOpacity style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}, stylesFirstHalf.caregiversButton]} onPress={() => {}}>
                <Text style={stylesFirstHalf.caregiversButtonText}>Cuidadores</Text>
            </TouchableOpacity>
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

function Functionalities({ navigation }: {readonly navigation: any}) {

    const CredencialsNavigation = () => {
        // Your code to handle the click event
        console.log('Credentials button clicked!');
        navigation.push('Credentials')
    }

    const GeneratorsNavigation = () => {
        // Your code to handle the click event
        console.log('Credentials button clicked!');
        navigation.push('Generator')
    }

    const FrequentQuestionsNavigation = () => {
        // Your code to handle the click event
        console.log('Questions button clicked!');
        navigation.push('FrequentQuestions')
    }

    const SettingsNavigation = () => {
        // Your code to handle the click event
        console.log('Questions button clicked!');
        navigation.push('Settings')
    }

    return (
        <View style={{flex: 0.65, marginTop: '10%', marginBottom: '10%', justifyContent: 'center', alignItems: 'center' }}>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%', borderRadius: 20, borderWidth: 5, justifyContent: 'center', alignItems: 'center'}, stylesOptions.squareCredentials]} onPress={() => CredencialsNavigation()}>
                    <Image source={require(credentialsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Credenciais</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%', borderRadius: 20, borderWidth: 5, justifyContent: 'center', alignItems: 'center'}, stylesOptions.squareGenerator]} onPress={() => GeneratorsNavigation()}>
                    <Image source={require(generatorImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{margin: '0%'}, stylesOptions.squareText]}>Nova Pass</Text>
                </TouchableOpacity>
           </View>
           <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[{width: '40%', margin: '3%', borderRadius: 20, borderWidth: 5, justifyContent: 'center', alignItems: 'center'}, stylesOptions.squareSettings]} onPress={() => SettingsNavigation()}>
                    <Image source={require(settingsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Definições</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{width: '40%', margin: '3%', borderRadius: 20, borderWidth: 5, justifyContent: 'center', alignItems: 'center'}, stylesOptions.squareQuestions]} onPress={() => FrequentQuestionsNavigation()}>
                    <Image source={require(questionsImage)} style={[stylesOptions.squarePhoto]}/>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesOptions.squareText]}>Perguntas</Text>
                </TouchableOpacity>
           </View>
        </View>
    );
}

export default function MainMenu({ navigation }: {readonly navigation: any}) {
    return (
        <View style={{ flex: 1, flexDirection: 'column', marginTop: '5%'}}>
            <UserInfo/>
            <Functionalities navigation={navigation}/>
        </View>
    );
}