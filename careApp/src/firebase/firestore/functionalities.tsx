import { Alert } from 'react-native';
import { encrypt, decrypt } from '../../algorithms/tweetNacl/crypto';
import { elderlyCollectionName, keyCollectionName, keyDocumentName, caregiverCollectionName, credencialsCollectionName, caregiversCollectionName, caregiversDocumentName, emptyValue, SaltDocumentName } from '../../assets/constants/constants';
import { CredentialType } from '../../screens/list_credentials/actions/types';
import { firebase } from '../FirebaseConfig';
import { defaultCaregiver, defaultCredencials, updateDataCredencial } from './constants';

const firestore = firebase.firestore()

/**
 * Função para obter a chave que se encontra na cloud.
 */
async function getKey(elderlyId: string): Promise<string> {
    console.log("===> getFirebaseKeyCalled")
    return firestore.collection(elderlyCollectionName)
        .doc(elderlyId).collection(keyCollectionName).doc(keyDocumentName).get().then((doc: any) => {
            if(doc.exists) {
                return doc.data().key
            } 
        })
        .catch((error: any) => {
            Alert.alert('Erro', 'Erro ao tentar obter a chave, tente novamente!')
            console.log('Error: ', error)
            return emptyValue
        })
}

/**
 * Função para adicionar uma nova credencial à coleção pertencente ao respetivo idoso.
 * @param userId 
 * @param newCredencialId 
 * @param data 
 */
async function addCredencialToFirestore(userId: string, encryptionKey: string, newCredencialId: string, data: string, isElderlyCredentials: boolean) {
    const encrypted = encrypt(data, encryptionKey)
    const credential = defaultCredencials(encrypted)

    const collection = isElderlyCredentials ? firestore.collection(elderlyCollectionName) : firestore.collection(caregiverCollectionName)
    await collection.doc(userId)
            .collection(credencialsCollectionName)
            .doc(newCredencialId)
            .set(credential)
        .catch((error: any) => {
            Alert.alert('Erro', 'Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
        })
}

/**
 * Função para listar as credenciais de determinado utilizador
 * @param userId 
 */
export async function listAllCredentialsFromFirestore(userId: string, encryptionKey: string, isElderlyCredentials: boolean): Promise<CredentialType[]> {

    let collection = isElderlyCredentials? firestore.collection(elderlyCollectionName) : firestore.collection(caregiverCollectionName)

    return collection.doc(userId).collection(credencialsCollectionName).get().then((docs: any) => {
        const values: CredentialType[] = []
        docs.forEach((doc: any) => { 
            if(doc.data()) {
                const decrypted = decrypt(doc.data().data, encryptionKey)
                values.push({id: doc.id, data: JSON.parse(decrypted)}) 
            }
        }); 
        return values
    }).catch((error: any) => {
        //alert('Erro ao obter as credenciais, tente novamente!')
        if(isElderlyCredentials) {
            Alert.alert('Erro', 'Erro ao obter as credenciais do idoso, verifique o estado da relação.')
        } else {
            Alert.alert('Erro', 'Não foi possível obter as credenciais.')
        }
        return []
    })
}

/**
 * Função para apagar uma credencial específica
 * @param credentialId 
 */
async function deleteCredential(userId: string, credentialId: string): Promise<boolean> {

    return firestore.collection(caregiverCollectionName).doc(userId)
            .collection(credencialsCollectionName)
            .doc(credentialId)
            .delete()
        .catch((error: any) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
            return false
        }).then(() => { return true })
}

async function updateCredentialFromFirestore(userId: string, credencialId: string, encryptionKey: string, data: string, isElderlyCredential: boolean): Promise<boolean> {
    console.log('Data: ', data)
    const encrypted = encrypt(data, encryptionKey) 
    
    const collection = isElderlyCredential ? firestore.collection(elderlyCollectionName) : firestore.collection(caregiverCollectionName)
    const updatedCredencial = updateDataCredencial(encrypted)
    return collection.doc(userId)
            .collection(credencialsCollectionName)
            .doc(credencialId)
            .update(updatedCredencial)
        .catch((error: any) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            //console.log('Error: ', error)
            return false
        }).then(() => { return true })
}

export async function getCaregiversArray(elderlyId: string, permission: string) {
    const privateCaregiverDocRef = firestore
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(caregiversCollectionName).doc(caregiversDocumentName)

    return privateCaregiverDocRef.get().then((doc: any) => { 
        if(!doc.exists) {
            return []
        }
        const elderlyDoc = doc.data()
        
        if(!elderlyDoc) {
            return
        }

        return elderlyDoc[permission] || []
    })
    .catch((error: any) => {
        Alert.alert('Erro', 'Erro ao obter os cuidadores que conseguem ler, tente novamente!')
        return []
    });
}

export async function verifyIfCanManipulateCredentials(userId: string, elderlyId: string) {
    return await getCaregiversArray(elderlyId, 'writeCaregivers').then(result => {
        return result.includes(userId)
    })
}

async function caregiverExists(caregiverId: string): Promise<boolean> {
    
    return firestore.collection(caregiverCollectionName).doc(caregiverId).get()
    .then((doc) => doc.exists)
    .catch((error) => {
        //alert('Erro ao verificar se o cuidador existe, tente novamente!')
        return false
    })
}

/**
 * Função para criar a coleção default para o idoso. Esta função apenas vai ser chamada uma vez,
 * respetivamente na criação da conta.
 * @returns 
 */
async function createCaregiver(caregiverId: string) {
    try {
        const caregiverCollectionRef = firestore.collection(caregiverCollectionName)

        //Cria na coleção o elemento do idoso.
        const novoDocumentoRef = caregiverCollectionRef.doc(caregiverId)
        novoDocumentoRef.set(defaultCaregiver)

    } catch (error) {
        Alert.alert('Erro', 'Erro ao tentar criar a conta na firebase!')
        //console.log('Error: ', error)
    }
}

export async function initFirestore(userId: string): Promise<boolean> {
    return caregiverExists(userId).then((result) => {
        if (!result) { //se não existir
            createCaregiver(userId)
            //console.log('Elderly created sucessfully!!')
        }
        return true
    }).catch(error => {
        //console.log('Error initFirestore: ', error)
        return false
    });
}

async function getServerIP(): Promise<string> {
    console.log("===> getServerIPCalled")
    const serverDocRef = firestore
        .collection("Server")
        .doc("server")
    
    return serverDocRef.get().then((doc) => {
        if (doc.exists) {
            const serverData = doc.data()
            if (serverData) return serverData.ip
        }
        return "";
    }).catch((error) => {
        Alert.alert('Erro', 'Erro ao obter o IP do servidor, tente novamente!');
        //console.error('Error: ', error);
        return ""
    })
}
/**
 * Posts the salt key for a given elderly ID.
 * @param caregiverId - The ID of the caregiver.
 * @param saltValue - The salt to be posted.
 * @returns A Promise that resolves to a boolean indicating if the salt key was successfully posted.
 */
export async function postSalt(caregiverId: string, saltValue: string, SaltCollectionName: string): Promise<boolean> {
    console.log("===> postSaltCalled")
    try {
        await firestore.collection(caregiverCollectionName)
            .doc(caregiverId).collection(SaltCollectionName).doc(SaltDocumentName)
            .set({ salt: saltValue })
        return true;
    } catch (error) {
        console.log('Error: ', error);
        return false;
    }
}

/**
 * Retrieves the salt key for a given elderly ID.
 * @param caregiverId - The ID of the caregiver.
 * @returns A Promise that resolves to the salt key as a string.
 */
export async function getSalt(caregiverId: string, SaltCollectionName: string): Promise<string> {
    console.log("===> getSaltCalled")
    return firestore.collection(caregiverCollectionName)
        .doc(caregiverId).collection(SaltCollectionName).doc(SaltDocumentName).get().then((doc: any) => {
            if(doc.exists) {
                return doc.data().salt
            } 
        })
        .catch((error: any) => {
            console.log('Error: ', error)
            return emptyValue
        })
}

export { getServerIP, deleteCredential, getKey, addCredencialToFirestore, updateCredentialFromFirestore }