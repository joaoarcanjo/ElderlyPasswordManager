import { decrypt, encrypt } from "../../../algorithms/0thers/crypto";
import { getCaregivers, deleteCaregiver } from "../../../database/caregivers";
import { CredentialLocalRecord, deleteCredentialFromLocalDB, getAllLocalCredentials, getCredential, insertCredentialToLocalDB, updateCredentialFromLocalDB } from "../../../database/credentials";
import { Caregiver, CaregiverRequestStatus } from "../../../database/types";
import { ErrorInstance } from "../../../exceptions/error";
import { Errors } from "../../../exceptions/types";
import { addCredencialToFirestore, deleteCredentialFromFiretore, getCaregiversArray, listAllElderlyCredencials, updateCredentialFromFiretore } from "../../../firebase/firestore/functionalities";
import { getKeychainValueFor } from "../../../keychain";
import { elderlyFireKey } from "../../../keychain/constants";

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

export const getAllCredentialsAndValidate = async (userId: string, localDbKey: string): Promise<(Credential | undefined)[]> => {
    console.log("===> getAllCredentialsAndValidateCalled")
    const userKey = await getKeychainValueFor(elderlyFireKey(userId))
    const credentialsCloud = await listAllElderlyCredencials(userId)
    const toReturn = await Promise.all(credentialsCloud.map(async value => {
        let credentialInfo = 'undefined'
        try {
            credentialInfo = await getCredential(userId, value.id)
            if (value.data.length != 0) {
                const credentialCloud = JSON.parse(decrypt(value.data, userKey)) as CredentialData

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
                    await updateCredentialFromFiretore(userId, value.id, JSON.stringify(credencialLocal))
                }
                return { id: value.id, data: credencialLocal }
            }
        }
    }))

    await addMissingCredentialsToReturn(toReturn, localDbKey, userId, userKey)
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

const addMissingCredentialsToReturn = async (toReturn: (Credential | undefined)[], localDbKey: string, userId: string, userKey: string) => {
    console.log("===> addMissingCredentialsToReturnCalled")
    
    const credenciaisLocal = await getAllLocalCredentialsFormatted(userId, localDbKey)
    credenciaisLocal.forEach(async value => {
        if(!value) return
        if (!toReturn.find(credential => credential?.id === value.id)) {
            toReturn.push(value)
            await addCredencialToFirestore(userId, userKey, value.id)
        }
    })
}

export const getAllLocalCredentialsFormatted = async (userId: string, localDBKey: string): Promise<(Credential | undefined)[]> => {
    console.log("===> getAllLocalCredentialsFormattedCalled")

    return await getAllLocalCredentials(userId) 
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
      if(caregiver.requestStatus === CaregiverRequestStatus.ACCEPTED || caregiver.requestStatus === CaregiverRequestStatus.RECEIVED) {
        caregiversPermissions.push({
          canRead: readCaregivers.includes(caregiver.caregiverId),
          canWrite: writeCaregivers.includes(caregiver.caregiverId),
          caregiver
        })
      } else if (caregiver.requestStatus === CaregiverRequestStatus.DECOUPLING) {
        try {
          await deleteCaregiver(userId, caregiver.email)
        } catch (error) {
          console.log('#1 Error deleting caregiver')
        }
      }
    })
    return caregiversPermissions
  }