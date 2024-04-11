import { decrypt, encrypt } from "../../../algorithms/0thers/crypto";
import { CredentialLocalRecord, getAllLocalCredentials, getCredential, insertCredentialToLocalDB, updateCredentialFromLocalDB } from "../../../database/credentials";
import { ErrorInstance } from "../../../exceptions/error";
import { Errors } from "../../../exceptions/types";
import { addCredencialToFirestore, listAllCredentialsFromFirestore, updateCredentialFromFirestore } from "../../../firebase/firestore/functionalities";

interface Credential {
    id: string,
    data: CredentialData
}

interface CredentialData {
    id: string,
    platform: string,
    uri: string,
    username: string,
    password: string,
    edited: {
        updatedBy: string,
        updatedAt: number
    }
}

export const getAllCredentialsAndValidate = async (userId: string, key: string): Promise<(Credential | undefined)[]> => {
    console.log("getAllCredentialsAndValidateCalled")

    const credentialsCloud = await listAllCredentialsFromFirestore(userId, key, false)
    let toReturn: (Credential | undefined)[] = []
    try {
        toReturn = await Promise.all(credentialsCloud.map(async cloudCredential => {
            const localCredential = await getCredential(userId, cloudCredential.id)
            try {
                if (cloudCredential.data.length != 0) {
                    const credentialCloud = JSON.parse(decrypt(cloudCredential.data, key)) as CredentialData

                    if (credentialCloud.id !== cloudCredential.id) {
                        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_INVALID_ID)
                    }
                    if (localCredential === '') {
                        await insertCredentialToLocalDB(userId, cloudCredential.id, encrypt(JSON.stringify(credentialCloud), key))
                    } else {
                        await updateCredentialIfNeeded(userId, cloudCredential.id, credentialCloud, key)
                    }
                    return { id: cloudCredential.id, data: credentialCloud }
                }
            } catch (error) {
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
        alert("Error validating credentials from cloud")
    }
    const credentialsLocal = await getAllLocalCredentials(userId)
    addMissingCredentialsToReturn(credentialsLocal, toReturn, key, userId)
    return toReturn
}

export const getAllLocalCredentialsFormatted = async (userId: string, localDBKey: string): Promise<(Credential | undefined)[]> => {
    console.log("===> getAllLocalCredentialsFormattedCalled")

    const credentialsLocal = await getAllLocalCredentials(userId)
        .then(async (credentialsLocal: CredentialLocalRecord[]) => {
            return credentialsLocal.map(value => {
                const credential = JSON.parse(decrypt(value.record, localDBKey)) as CredentialData
                return { id: credential.id, data: credential }
            })
        })
        .catch(() => {
            console.log('#1 Error getting all local credentials')
            return []
        })

    return credentialsLocal;
}

export const getAllLocalCredentialsFormattedWithFilter = async (userId: string, localDBKey: string, platformFilter: string): Promise<(Credential | undefined)[]> => {
    console.log("===> getAllLocalCredentialsFormattedWithFilterCalled")

    const credentialsLocal = await getAllLocalCredentials(userId)
        .then(async (credentialsLocal: CredentialLocalRecord[]) => {
            return credentialsLocal.map(value => {
                const credential = JSON.parse(decrypt(value.record, localDBKey)) as CredentialData
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

const addMissingCredentialsToReturn = (credentialsLocal: any[], toReturn: (Credential | undefined)[], key: string, userId: string) => {
    
    credentialsLocal.forEach(value => {
        if (!toReturn.find(credential => credential?.id === value.credentialId)) {
            const credentialLocal = JSON.parse(decrypt(value.record, key))
            toReturn.push({ id: value.credentialId, data: credentialLocal })
            addCredencialToFirestore(userId, key, value.credentialId, JSON.stringify(credentialLocal), false)
        }
    })
}