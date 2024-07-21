import { Alert } from "react-native";
import { decrypt, encrypt } from "../../../algorithms/tweetNacl/crypto";
import { emptyValue } from "../../../assets/constants/constants";
import { CredentialLocalRecord, getAllCredentialsFromLocalDB, getCredentialFromLocalDB, insertCredentialToLocalDB, updateCredentialFromLocalDB } from "../../../database/credentials";
import { ErrorInstance } from "../../../exceptions/error";
import { Errors } from "../../../exceptions/types";
import { addCredencialToFirestore, listAllCredentialsFromFirestore, updateCredentialFromFirestore } from "../../../firebase/firestore/functionalities";
import { CredentialType } from "./types";
import { getKeychainValueFor } from "../../../keychain";
import { localDBKey as localDBKeyChain } from '../../../keychain/constants';


export const getAllCredentialsAndValidate = async (userId: string, firebaseKey: string, localDbKey: string): Promise<(CredentialType | undefined)[]> => {
    console.log("getAllCredentialsAndValidateCalled")

    if(localDbKey == '') {
        localDbKey = await getKeychainValueFor(localDBKeyChain(userId))
    }

    const credentialsCloud = await listAllCredentialsFromFirestore(userId, firebaseKey, false)
    let toReturn: (CredentialType | undefined)[] = []
    try {
        toReturn = await Promise.all(credentialsCloud.map(async cloudCredential => {
            const localCredential = await getCredentialFromLocalDB(userId, cloudCredential.id)
            try {
                if (cloudCredential.data) {
                    let credentialCloud = cloudCredential.data
                    if (credentialCloud.id !== cloudCredential.id) {
                        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_INVALID_ID)
                    }
                    if (localCredential === emptyValue) {
                        await insertCredentialToLocalDB(userId, cloudCredential.id, encrypt(JSON.stringify(credentialCloud), localDbKey))
                    } else {
                        await updateCredentialIfNeeded(userId, cloudCredential.id, credentialCloud, localDbKey)
                    }
                    return { id: cloudCredential.id, data: credentialCloud }
                }
            } catch (error) {
                const errorAux = error as ErrorInstance
                if (errorAux.code === Errors.ERROR_INVALID_MESSAGE_OR_KEY ||
                errorAux.code === Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED ||
                errorAux.code === Errors.ERROR_CREDENTIAL_INVALID_ID) {
                    const localParsed = JSON.parse(decrypt(localCredential, localDbKey))
                    if (localParsed) {
                        updateCredentialFromFirestore(userId, cloudCredential.id, firebaseKey, JSON.stringify(localParsed), false)
                    }
                    return { id: cloudCredential.id, data: localParsed }
                }
            }
        }))
    } catch (error) {
        Alert.alert('Informação', "Erro ao tentar obter as credenciais da cloud")
    }
    const credentialsLocal = await getAllCredentialsFromLocalDB(userId)
    addMissingCredentialsToReturn(credentialsLocal, toReturn, firebaseKey, localDbKey, userId)
    return toReturn
}

export const getAllCredentialsFromLocalDBFormatted = async (userId: string, localDBKey: string): Promise<(CredentialType | undefined)[]> => {
    console.log("===> getAllCredentialsFromLocalDBFormattedCalled")

    const credentialsLocal = await getAllCredentialsFromLocalDB(userId)
        .then(async (credentialsLocal: CredentialLocalRecord[]) => {
            return credentialsLocal.map(value => {
                const credential = JSON.parse(decrypt(value.record, localDBKey))
                return { id: credential.id, data: credential }
            })
        })
        .catch((error) => {
            console.log('#1 Error getting all local credentials')
            return []
        })

    return credentialsLocal
}

export const getAllCredentialsFromLocalDBFormattedWithFilter = async (userId: string, localDBKey: string, platformFilter: string): Promise<(CredentialType | undefined)[]> => {
    console.log("===> getAllCredentialsFromLocalDBFormattedWithFilterCalled")

    const credentialsLocal = await getAllCredentialsFromLocalDB(userId)
        .then(async (credentialsLocal: CredentialLocalRecord[]) => {
            return credentialsLocal.map(value => {
                const credential = JSON.parse(decrypt(value.record, localDBKey))
                if (credential.platform.toLowerCase().includes(platformFilter.toLowerCase())) {
                    return { id: credential.id, data: credential }
                }
                return undefined
            }).filter(Boolean)
        })
        .catch((error) => {
            console.log('#1 Error getting all local credentials')
            return []
        })
    return credentialsLocal
}

const updateCredentialIfNeeded = async (userId: string, credentialId: string, credentialCloud: any, localDBKey: string) => {
    const credentialInfo = await getCredentialFromLocalDB(userId, credentialId)
    const credencialLocal = JSON.parse(decrypt(credentialInfo, localDBKey))
    if (credencialLocal.edited.updatedAt < credentialCloud.edited.updatedAt) {
        updateCredentialFromLocalDB(userId, credentialId, encrypt(JSON.stringify(credentialCloud), localDBKey))
    } else if (credencialLocal.edited.updatedAt > credentialCloud.edited.updatedAt) {
        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED)
    }
};

const addMissingCredentialsToReturn = (credentialsLocal: any[], toReturn: (CredentialType | undefined)[], firebaseKey: string, localDbKey: string, userId: string) => {
    
    console.log("Local credentials: ", credentialsLocal)  
    credentialsLocal.forEach(value => {
        if(!value) return
        console.log("LocalDbKey: ", localDbKey)
        if (!toReturn.find(credential => credential?.id === value.credentialId)) {
            const credentialLocal = JSON.parse(decrypt(value.record, localDbKey))
            toReturn.push({ id: value.credentialId, data: credentialLocal })
            addCredencialToFirestore(userId, firebaseKey, value.credentialId, JSON.stringify(credentialLocal), false)
        }
    })
}