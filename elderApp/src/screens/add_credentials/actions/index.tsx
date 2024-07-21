import React, { useState } from "react";
import { View } from "react-native";
import  { Navbar } from "../../../navigation/actions";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import MainBox from "../../../components/MainBox";
import { cardLabel, loginLabel, pageAddCredentialTitle } from "../../../assets/constants/constants";
import CredentialsLoginInput from "./credentialLoginInput";
import CredentialsCardInput from "./credentialCardInput";
import { CredentialTypeModal } from "../../../components/Modal";

function Input() {

    const [option, setOption] = useState('')
    const [modalVisible, setModalVisible] = useState(true)

    return (
        <View style={{width: '100%'}}>
            <View style={{marginVertical: '1%'}}>
                {option == loginLabel ? <CredentialsLoginInput /> : <></>}
                {option == cardLabel ? <CredentialsCardInput /> : <></>}
            </View>
            <CredentialTypeModal 
                question={"Selecione o tipo de credencial que deseja adicionar:\n"} 
                loginFunction={() => {setOption(loginLabel); setModalVisible(false)}} 
                cardFunction={() => {setOption(cardLabel); setModalVisible(false)}} 
                visibleFlag={modalVisible} 
            />
        </View>
    )
}

export function AddCredencial() {
    return (
        <>
        <KeyboardAvoidingWrapper>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainBox text={pageAddCredentialTitle}/>
                <Input/>
            </View>
        </KeyboardAvoidingWrapper>
        <Navbar/>
        </>
    )
}