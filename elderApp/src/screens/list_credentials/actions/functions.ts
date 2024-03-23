import { decrypt, encrypt } from "../../../algorithms/0thers/crypto";
import { deriveSecret } from "../../../algorithms/sss/sss";
import { deleteCredentialFromLocalDB, getAllLocalCredentials, getCredential, insertCredentialToLocalDB, updateCredentialFromLocalDB } from "../../../database/credentials";
import { ErrorInstance } from "../../../exceptions/error";
import { Errors } from "../../../exceptions/types";
import { addCredencialToFirestore, deleteCredentialFromFiretore, getKey, listAllElderlyCredencials, updateCredentialFromFiretore } from "../../../firebase/firestore/functionalities";

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

export const getAllCredentialsAndValidate = async (userId: string, userShared: string, localDbKey: string): Promise<(Credential | undefined)[]> => {
    console.log("getAllCredentialsAndValidateCalled")
    const cloudKey = await getKey(userId)
    const key = deriveSecret([cloudKey, userShared])

    const credentialsCloud = await listAllElderlyCredencials(userId)
    const toReturn = await Promise.all(credentialsCloud.map(async value => {
        const credentialInfo = await getCredential(userId, value.id)
        try {
            if (value.data.length != 0) {
                const credentialCloud = JSON.parse(decrypt(value.data, key)) as CredentialData

                if (credentialCloud.id !== value.id) {
                    throw new ErrorInstance(Errors.ERROR_CREDENTIAL_INVALID_ID)
                }
                if (credentialInfo === '') {
                    await insertCredentialToLocalDB(userId, value.id, encrypt(JSON.stringify(credentialCloud), localDbKey))
                } else {
                    await deleteCredentialIfNeeded(userId, value.id, credentialCloud, localDbKey)
                    await updateCredentialIfNeeded(userId, value.id, credentialCloud, localDbKey)
                }
                return { id: value.id, data: credentialCloud }
            }
        } catch (error) {
            const errorAux = error as ErrorInstance
            if (errorAux.code === Errors.ERROR_INVALID_MESSAGE_OR_KEY ||
            errorAux.code === Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED ||
            errorAux.code === Errors.ERROR_CREDENTIAL_INVALID_ID) {

            const credencialLocal = JSON.parse(decrypt(credentialInfo, localDbKey))
            if (credencialLocal) {
                updateCredentialFromFiretore(userId, value.id, userShared, JSON.stringify(credencialLocal))
            }
            return { id: value.id, data: credencialLocal }
            }
        }
    }))

    const credentialsLocal = await getAllLocalCredentials(userId)
    addMissingCredentialsToReturn(credentialsLocal, toReturn, localDbKey, userId, userShared);
    return toReturn
}

const deleteCredentialIfNeeded = async (userId: string, credentialId: string, credentialCloud: any, localDBKey: string) => {
    const credentialInfo = await getCredential(userId, credentialId)
    const credencialLocal = JSON.parse(decrypt(credentialInfo, localDBKey))
    if (credentialCloud.uri == '' &&
        credentialCloud.username == '' &&
        credentialCloud.password == '' &&
        credentialCloud.edited.updatedAt >= credencialLocal.edited.updatedAt) {
        await deleteCredentialFromLocalDB(userId, credentialId)
        await deleteCredentialFromFiretore(userId, credentialId)
        return undefined
    }
};

const updateCredentialIfNeeded = async (userId: string, credentialId: string, credentialCloud: any, localDBKey: string) => {
    const credentialInfo = await getCredential(userId, credentialId)
    const credencialLocal = JSON.parse(decrypt(credentialInfo, localDBKey))
    if (credencialLocal.edited.updatedAt < credentialCloud.edited.updatedAt) {
        updateCredentialFromLocalDB(userId, credentialId, encrypt(JSON.stringify(credentialCloud), localDBKey))
    } else if (credencialLocal.edited.updatedAt > credentialCloud.edited.updatedAt) {
        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED)
    }
};

const addMissingCredentialsToReturn = (credentialsLocal: any[], toReturn: (Credential | undefined)[], localDbKey: string, userId: string, userShared: string) => {
    
    credentialsLocal.forEach(value => {
        if (!toReturn.find(credential => credential?.id === value.credentialId)) {
            const credentialLocal = JSON.parse(decrypt(value.record, localDbKey))
            toReturn.push({ id: value.credentialId, data: credentialLocal })
            addCredencialToFirestore(userId, userShared, value.credentialId, JSON.stringify(credentialLocal))
        }
    })
}