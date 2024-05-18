import React, { useState } from "react";
import { View} from "react-native";
import { cardLabel, loginLabel, pageAddCredentialTitle } from "../../../assets/constants/constants";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import MainBox from "../../../components/MainBox";
import { Navbar } from "../../../navigation/actions";
import { CredentialsLoginInput } from "./credentialLoginInput";
import { CredentialsCardInput } from "./credentialCardInput";
import { CredentialTypeModal } from "../../../components/Modal";

function Input({ ownerId, auxKey, isElderlyCredential }: Readonly<{ownerId: string, auxKey: string, isElderlyCredential: boolean }>) {

    const [option, setOption] = useState('')
    const [modalVisible, setModalVisible] = useState(true)

    return (
        <View style={{width: '100%'}}>

            <View style={{marginVertical: '5%'}}>
                {option == loginLabel ? <CredentialsLoginInput auxKey={auxKey} ownerId={ownerId} isElderlyCredential={isElderlyCredential} /> : <></>}
                {option == cardLabel ? <CredentialsCardInput auxKey={auxKey} ownerId={ownerId} isElderlyCredential={isElderlyCredential}/> : <></>}
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