import { Alert } from "react-native";
import { decrypt, encrypt } from "../../../algorithms/tweetNacl/crypto";
import { emptyValue } from "../../../assets/constants/constants";
import { CredentialLocalRecord, getAllLocalCredentials, getCredential, insertCredentialToLocalDB, updateCredentialFromLocalDB } from "../../../database/credentials";
import { ErrorInstance } from "../../../exceptions/error";
import { Errors } from "../../../exceptions/types";
import { addCredencialToFirestore, listAllCredentialsFromFirestore, updateCredentialFromFirestore } from "../../../firebase/firestore/functionalities";
import { CredentialType } from "./types";


export const getAllCredentialsAndValidate = async (userId: string, key: string): Promise<(CredentialType | undefined)[]> => {
    console.log("getAllCredentialsAndValidateCalled")
    const credentialsCloud = await listAllCredentialsFromFirestore(userId, key, false)
    let toReturn: (CredentialType | undefined)[] = []
    try {
        toReturn = await Promise.all(credentialsCloud.map(async cloudCredential => {
            const localCredential = await getCredential(userId, cloudCredential.id)
            try {
                if (cloudCredential.data) {
                    const credentialCloud = cloudCredential.data
                    if (credentialCloud.id !== cloudCredential.id) {
                        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_INVALID_ID)
                    }
                    if (localCredential === emptyValue) {
                        await insertCredentialToLocalDB(userId, cloudCredential.id, encrypt(JSON.stringify(credentialCloud), key))
                    } else {
                        await updateCredentialIfNeeded(userId, cloudCredential.id, credentialCloud, key)
                    }
                    return { id: cloudCredential.id, data: credentialCloud }
                }
            } catch (error) {
                console.log("error", error)
                const errorAux = error as ErrorInstance
                if (errorAux.code === Errors.ERROR_INVALID_MESSAGE_OR_KEY ||
                errorAux.code === Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED ||
                errorAux.code === Errors.ERROR_CREDENTIAL_INVALID_ID) {

                const localParsed = JSON.parse(decrypt(localCredential, key))
                if (localParsed) {
                    updateCredentialFromFirestore(userId, cloudCredential.id, key, JSON.stringify(localParsed), false)
                }
                return { id: cloudCredential.id, data: localParsed }
                }
            }
        }))
    } catch (error) {
        Alert.alert('Informação', "Erro ao tentar obter as credenciais da cloud")
    }
    const credentialsLocal = await getAllLocalCredentials(userId)
    addMissingCredentialsToReturn(credentialsLocal, toReturn, key, userId)
    return toReturn
}

export const getAllLocalCredentialsFormatted = async (userId: string, localDBKey: string): Promise<(CredentialType | undefined)[]> => {
    console.log("===> getAllLocalCredentialsFormattedCalled")

    const credentialsLocal = await getAllLocalCredentials(userId)
        .then(async (credentialsLocal: CredentialLocalRecord[]) => {
            return credentialsLocal.map(value => {
                const credential = JSON.parse(decrypt(value.record, localDBKey))
                return { id: credential.id, data: credential }
            })
        })
        .catch(() => {
            console.log('#1 Error getting all local credentials')
            return []
        })

    return credentialsLocal
}

export const getAllLocalCredentialsFormattedWithFilter = async (userId: string, localDBKey: string, platformFilter: string): Promise<(CredentialType | undefined)[]> => {
    console.log("===> getAllLocalCredentialsFormattedWithFilterCalled")

    const credentialsLocal = await getAllLocalCredentials(userId)
        .then(async (credentialsLocal: CredentialLocalRecord[]) => {
            return credentialsLocal.map(value => {
                const credential = JSON.parse(decrypt(value.record, localDBKey))
                if (credential.platform.toLowerCase().includes(platformFilter.toLowerCase())) {
                    return { id: credential.id, data: credential }
                }
                return undefined
            }).filter(Boolean)
        })
        .catch(() => {
            console.log('#1 Error getting all local credentials')
            return []
        })
    return credentialsLocal
}

const updateCredentialIfNeeded = async (userId: string, credentialId: string, credentialCloud: any, localDBKey: string) => {
    const credentialInfo = await getCredential(userId, credentialId)
    const credencialLocal = JSON.parse(decrypt(credentialInfo, localDBKey))
    if (credencialLocal.edited.updatedAt < credentialCloud.edited.updatedAt) {
        updateCredentialFromLocalDB(userId, credentialId, encrypt(JSON.stringify(credentialCloud), localDBKey))
    } else if (credencialLocal.edited.updatedAt > credentialCloud.edited.updatedAt) {
        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED)
    }
};

const addMissingCredentialsToReturn = (credentialsLocal: any[], toReturn: (CredentialType | undefined)[], key: string, userId: string) => {
    
    credentialsLocal.forEach(value => {
        if(!value) return
        if (!toReturn.find(credential => credential?.id === value.credentialId)) {
            const credentialLocal = JSON.parse(decrypt(value.record, key))
            toReturn.push({ id: value.credentialId, data: credentialLocal })
            addCredencialToFirestore(userId, key, value.credentialId, JSON.stringify(credentialLocal), false)
        }
    })
}