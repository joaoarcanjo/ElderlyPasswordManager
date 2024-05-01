import React, { useState } from "react";
import { TouchableOpacity, View, Text, Image, Keyboard } from "react-native";
import { cardLabel, loginLabel, pageAddCredentialTitle } from "../../../assets/constants";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import MainBox from "../../../components/MainBox";
import { Navbar } from "../../../navigation/actions";
import { stylesButtons } from "../../../assets/styles/main_style";
import { CredentialsLoginInput } from "./credentialLoginInput";
import { CredentialsCardInput } from "./credentialCardInput";

function Input({ ownerId, auxKey, isElderlyCredential }: Readonly<{ownerId: string, auxKey: string, isElderlyCredential: boolean }>) {

    const [option, setOption] = useState(false)

    return (
        <View style={{width: '100%'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: '5%', marginHorizontal: '10%'}}>
                <TouchableOpacity style={[stylesButtons.mainConfig, stylesButtons.acceptButton, {flex: 0.25}]} onPress={() => setOption(false)}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 19, margin: '5%'}}>{loginLabel}</Text>
                </TouchableOpacity>
                <View style={{flex: 0.5}}>
                {option ? 
                    <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                    <Image source={require('../../../assets/images/right-arrow.png')} style={[{width: '100%', height: '200%', marginRight: '5%', resizeMode: 'contain'}]}/>
                    </View> :
                    <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                    <Image source={require('../../../assets/images/left-arrow.png')} style={[{width: '100%', height: '200%', marginRight: '5%', resizeMode: 'contain'}]}/>
                    </View>}  
                </View>
                <TouchableOpacity style={[stylesButtons.mainConfig, stylesButtons.acceptButton, {flex: 0.25}]} onPress={() => setOption(true)}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 19, margin: '5%'}}>{cardLabel}</Text>
                </TouchableOpacity>
            </View>
            {option ? <CredentialsCardInput auxKey={auxKey} ownerId={ownerId} isElderlyCredential={isElderlyCredential}/> : <CredentialsLoginInput auxKey={auxKey} ownerId={ownerId} isElderlyCredential={isElderlyCredential} />}
        </View>
    )
}

export function AddCredencial({ route }: Readonly<{route: any}>) {
    return (
        <>
        <KeyboardAvoidingWrapper>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainBox text={pageAddCredentialTitle}/>
                <Input auxKey={route.params.key} ownerId={route.params.userId} isElderlyCredential={route.params.isElderlyCredential} />
            </View>
        </KeyboardAvoidingWrapper>
        <Navbar/>
        </>
    )
}