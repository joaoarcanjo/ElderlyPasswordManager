import { decrypt, encrypt } from "../../../algorithms/0thers/crypto";
import { getCaregivers } from "../../../database/caregivers";
import { CredentialLocalRecord, deleteCredentialFromLocalDB, getAllLocalCredentials, getCredential, insertCredentialToLocalDB, updateCredentialOnLocalDB } from "../../../database/credentials";
import { Caregiver, CaregiverRequestStatus } from "../../../database/types";
import { ErrorInstance } from "../../../exceptions/error";
import { Errors } from "../../../exceptions/types";
import { addCredencialToFirestore, deleteCredentialFromFiretore, getCaregiversArray, listAllElderlyCredencials, updateCredentialFromFiretore } from "../../../firebase/firestore/functionalities";
import { getKeychainValueFor } from "../../../keychain";
import { elderlyFireKey } from "../../../keychain/constants";
import { CredentialType } from "./types";

export const getAllCredentialsAndValidate = async (userId: string, localDbKey: string): Promise<(CredentialType | undefined)[]> => {
    console.log("===> getAllCredentialsAndValidateCalled")
    const userKey = await getKeychainValueFor(elderlyFireKey(userId))
    const credentialsCloud = await listAllElderlyCredencials(userId)
    let toReturn: (CredentialType | undefined)[] = []
    try {
        toReturn = await Promise.all(credentialsCloud.map(async value => {
            let credentialInfo = undefined
            try {
                credentialInfo = await getCredential(userId, value.id)
                if (value.data.length != 0) {
                    let credentialCloud = undefined
                    const valueDecrypted = decrypt(value.data, userKey)
                    credentialCloud = JSON.parse(valueDecrypted)
                    if (credentialCloud.id !== value.id) {
                        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_INVALID_ID)
                    }
                    if (credentialInfo === '') {
                        if ((credentialCloud.type === 'login' && (credentialCloud.password === '' || credentialCloud.username === '' || credentialCloud.uri === '')) ||
                            (credentialCloud.type === 'card' && (credentialCloud.cardNumber === '' || credentialCloud.ownerName === '' || credentialCloud.securityCode === ''))) {
                            await deleteCredentialFromLocalDB(userId, value.id)
                        } else {
                            await insertCredentialToLocalDB(userId, value.id, encrypt(JSON.stringify(credentialCloud), localDbKey))
                        }
                    } else {
                        await deleteCredentialIfNeeded(userId, value.id, credentialCloud, credentialInfo, localDbKey)
                        await updateCredentialIfNeeded(userId, value.id, credentialCloud, credentialInfo, localDbKey)
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
                        await updateCredentialFromFiretore(userId, value.id, JSON.stringify(credencialLocal))
                    }
                    return { id: value.id, data: credencialLocal }
                }
            }
        }))
    } catch (error) {  
        alert("Error validating credentials from cloud")
    }
    await addMissingCredentialsToReturn(toReturn, localDbKey, userId, userKey)
    return toReturn
}

const deleteCredentialIfNeeded = async (userId: string, credentialId: string, credentialCloud: any, credentialInfo: any, localDBKey: string) => {
    const credencialLocal = JSON.parse(decrypt(credentialInfo, localDBKey))
    if ((credentialCloud.type === 'login' && credentialCloud.password === '' && credentialCloud.username === '' && credentialCloud.uri === '' && credentialCloud.edited.updatedAt > credencialLocal.edited.updatedAt) ||
        (credentialCloud.type === 'card' && credentialCloud.cardNumber === '' && credentialCloud.ownerName === '' && credentialCloud.securityCode === '' && credentialCloud.edited.updatedAt > credencialLocal.edited.updatedAt)) {
        await deleteCredentialFromLocalDB(userId, credentialId)
        await deleteCredentialFromFiretore(userId, credentialId)
        return undefined
    }
};

const updateCredentialIfNeeded = async (userId: string, credentialId: string, credentialCloud: any, credentialInfo: any, localDBKey: string) => {
    const credencialLocal = JSON.parse(decrypt(credentialInfo, localDBKey))
    if (credentialCloud.edited.updatedAt > credencialLocal.edited.updatedAt) {
        updateCredentialOnLocalDB(userId, credentialId, encrypt(JSON.stringify(credentialCloud), localDBKey))
    } else if (credencialLocal.edited.updatedAt > credentialCloud.edited.updatedAt) {
        throw new ErrorInstance(Errors.ERROR_CREDENTIAL_ON_CLOUD_OUTDATED)
    }
};

const addMissingCredentialsToReturn = async (toReturn: (CredentialType | undefined)[], localDbKey: string, userId: string, userKey: string) => {
    console.log("===> addMissingCredentialsToReturnCalled")
    
    const credenciaisLocal = await getAllLocalCredentialsFormatted(userId, localDbKey)
    credenciaisLocal.forEach(async value => {
        if(!value) return
        if (!toReturn.find(credential => credential?.data.id === value.id)) {
            toReturn.push(value)
            await addCredencialToFirestore(userId, value.id, JSON.stringify(value.data))
        }
    })
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

    return credentialsLocal;
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

export interface CaregiverPermission {
    canRead: boolean,
    canWrite: boolean,
    caregiver: Caregiver
  }
  
  export async function getCaregiversPermissions(userId: string): Promise<CaregiverPermission[]> {
    console.log('===> getCaregiversPermissionsCalled')
    const caregivers = await getCaregivers(userId)
    const readCaregivers = await getCaregiversArray(userId, 'readCaregivers')
    const writeCaregivers = await getCaregiversArray(userId, 'writeCaregivers')
  
    let caregiversPermissions: CaregiverPermission[] = []
    caregivers.forEach(async (caregiver) => {
      if(caregiver.requestStatus === CaregiverRequestStatus.ACCEPTED 
        || caregiver.requestStatus === CaregiverRequestStatus.RECEIVED 
        || caregiver.requestStatus === CaregiverRequestStatus.WAITING) {
        caregiversPermissions.push({
          canRead: readCaregivers.includes(caregiver.caregiverId),
          canWrite: writeCaregivers.includes(caregiver.caregiverId),
          caregiver
        })
      }
    })
    return caregiversPermissions
  }