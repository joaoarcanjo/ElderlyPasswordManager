import React, { useState } from "react";
import { TextInput, View, StyleSheet, Button, Text, TouchableOpacity } from "react-native";
import { stylesButtons, stylesMainBox } from "../../../assets/styles/main_style";
import { passwordFirstHalf, stylesAddCredential, stylesInputsCredencials } from "../styles/styles";
import { whiteBackgroud } from "../../../assets/styles/colors";
import Navbar from "../../../navigation/actions";
import { addCredencial } from "../../../firebase/firestore/funcionalities";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 


function MainBox() {

    return (
      <View style= { { flex: 0.15, flexDirection: 'row'} }>
          <View style={[{flex: 1, margin: '5%', justifyContent: 'center',  alignItems: 'center'}, stylesMainBox.pageInfoContainer]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[stylesMainBox.pageInfoText]}>Adicionar credencial</Text>
          </View>
      </View>
    )
}

function CredentialsInput() {


    const [platform, setPlatform] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false); 
  
    const handleSave = () => {
      // Implementar lógica para salvar as informações
      console.log('Plataforma:', platform);
      console.log('Username:', username);
      console.log('Password:', password);
      // Adicione sua lógica de salvamento aqui (por exemplo, enviar para um servidor, salvar no estado global, etc.)
        
      addCredencial(platform, JSON.stringify({platform: platform, username: username, password: password}))
    };

    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    };

    return (

        <View style={[{flex: 0.85}]}>
            <View style={{ flex: 0.23, width: '95%', flexDirection: 'row'}}>
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '4%'}, stylesInputsCredencials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.3, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>APP</Text>
                    <View style={[{flex: 0.7, margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder="Insira a plataforma"
                        value={platform}
                        style={{ flex: 0.8, fontSize: 17, marginRight: '5%' }}
                        onChangeText={text => setPlatform(text)}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 0.23, width: '95%', flexDirection: 'row'}}>
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '4%'}, stylesInputsCredencials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.3, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Username</Text>
                    <View style={[{flex: 0.7, margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder="Insira o seu username"
                        value={username}
                        style={{ flex: 0.8, fontSize: 17, marginRight: '5%' }}
                        onChangeText={text => setUsername(text)}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 0.4, width: '95%', flexDirection: 'row'}}>
                <View style={[{flex: 1, marginTop:'3%', marginHorizontal: '4%'}, stylesInputsCredencials.inputContainer]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[{flex: 0.3, marginTop: '3%', marginLeft: '5%', width: '90%', justifyContent: 'center', fontSize: 20}]}>Password</Text>
                    <View style={[{flex: 0.7, margin: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, { borderRadius: 15, borderWidth: 2, backgroundColor: whiteBackgroud }]}>
                        <TextInput
                        placeholder="Insira a password"
                        value={password}
                        style={{ flex: 0.8, fontSize: 17, marginRight: '5%' }}
                        secureTextEntry={!showPassword}
                        onChangeText={text => setPassword(text)}
                        />
                        <Entypo name="emoji-sad" size={35} color="orange" />
                    </View>
                    
                    
                    <View style={{flexDirection: 'row', margin: '5%'}}>
                        <TouchableOpacity style={[{flex: 0.35, marginRight: '2%', flexDirection: 'row'}, passwordFirstHalf.copyButton, stylesButtons.mainConfig]}  onPress={toggleShowPassword} >
                            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={35} color="black"/> 
                        </TouchableOpacity>
                        <TouchableOpacity style={[{flex: 0.65, marginLeft: '2%'}, passwordFirstHalf.regenerateButton, stylesButtons.mainConfig]} onPress={() => {} }>
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
//<Entypo name="emoji-flirt" size={24} color="black" />
//<Entypo name="emoji-happy" size={24} color="black" />
//<Entypo name="emoji-sad" size={35} color="orange" />
//<Entypo name="emoji-neutral" size={30} color="black" />


function AddCredencial() {

    return (
        <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center'}}>
          <MainBox/>
          <CredentialsInput/>
          <Navbar/>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      padding: 10,
    },
  });
  

export { AddCredencial }