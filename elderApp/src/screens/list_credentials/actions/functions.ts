import { decrypt, encrypt } from "../../../algorithms/0thers/crypto";
import { deriveSecret } from "../../../algorithms/sss/sss";
import { getAllLocalCredentials, getCredential, insertCredential, updateCredential } from "../../../database/credentials";
import { ErrorInstance } from "../../../exceptions/error";
import { Errors } from "../../../exceptions/types";
import { addCredencialToFirestore, getKey, listAllElderlyCredencials, updateCredential as updateCrentialOnFirestore } from "../../../firebase/firestore/functionalities";

interface Credential {
    id: string,
    data: {
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
}

export const getAllCredentialsAndValidate = async (userId: string, userShared: string, localDbKey: string): Promise<(Credential | undefined)[]> => {
    console.log("GetAllCredentialsBigFunctionCalled")
    const cloudKey = await getKey(userId)
    const key = deriveSecret([cloudKey, userShared])

    const credentialsCloud = await listAllElderlyCredencials(userId)
    const credentialsLocal = await getAllLocalCredentials(userId)

    const toReturn = await Promise.all(credentialsCloud.map(async value => {

        const credentialInfo = await getCredential(userId, value.id)
        try {
            if (value.data.length != 0) {
                const credentialCloud = JSON.parse(decrypt(value.data, key))

                if(credentialCloud.id !== value.id) {
                    throw new ErrorInstance(Errors.ERROR_CREDENTIAL_INVALID_ID)
                }
                // Inside the getAllCredentialsAndValidate function
                if (credentialInfo === '') {
                    insertCredential(userId, value.id, encrypt(JSON.stringify(credentialCloud), localDbKey));
                } else {
                    await updateCredentialIfNeeded(userId, value.id, credentialCloud, localDbKey);
                }                 
                return { id: value.id, data: credentialCloud }
            }
        } catch (error) {
            const errorAux = error as ErrorInstance
            if (errorAux.code === Errors.ERROR_INVALID_MESSAGE_OR_KEY ||
                errorAux.code === Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED ||
                errorAux.code === Errors.ERROR_CREDENTIAL_INVALID_ID) {
                
                const credencialLocal = JSON.parse(decrypt(credentialInfo, localDbKey))
                if(credencialLocal) {
                    updateCrentialOnFirestore(userId, value.id, userShared, JSON.stringify(credencialLocal)) // Add missing arguments
                }
                return  { id: value.id, data: credencialLocal }
            }
        }
    }))

    addMissingCredentialsToReturn(credentialsLocal, toReturn, localDbKey, userId, userShared);

    return toReturn
}


const updateCredentialIfNeeded = async (userId: string, credentialId: string, credentialCloud: any, localDbKey: string) => {
    const credentialInfo = await getCredential(userId, credentialId);
    const credencialLocal = JSON.parse(decrypt(credentialInfo, localDbKey));
    if (credencialLocal.edited.updatedAt < credentialCloud.edited.updatedAt) {
        updateCredential(userId, credentialId, encrypt(JSON.stringify(credentialCloud), localDbKey));
    } else if (credencialLocal.edited.updatedAt > credentialCloud.edited.updatedAt) {
        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED);
    }
};

const addMissingCredentialsToReturn = (credentialsLocal: any[], toReturn: (Credential | undefined)[], localDbKey: string, userId: string, userShared: string) => {
    credentialsLocal.forEach(value => {
        if (!toReturn.find(credential => credential?.id === value.credentialId)) {
            const credentialLocal = JSON.parse(decrypt(value.record, localDbKey))
            toReturn.push({ id: value.credentialId, data: credentialLocal })
            addCredencialToFirestore(userId, userShared, value.credentialId, JSON.stringify(credentialLocal)) // Add missing arguments
        }
    })
}