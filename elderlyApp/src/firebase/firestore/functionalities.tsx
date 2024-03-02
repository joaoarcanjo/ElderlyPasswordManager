import { decrypt, encrypt } from '../../algorithms/0thers/crypto';
import { deriveSecret } from '../../algorithms/sss/sss';
import { getValueFor } from '../../keychain';
import { firestoreSSSKey } from '../../keychain/constants';
import { firebase } from '../FirebaseConfig';
import { credencialsCollectionName, defaultCaregivers, defaultCredencials, defaultElderly, elderlyCollectionName, keyCollectionName, keyDocumentName, privateCaregiversDocumentName, privateCollectionName, updateDataCredencial } from './constants';

const firestore = firebase.firestore()

/**
 * Função para alterar a chave que se encontra na cloud.
 */
async function changeKey(userId: string) {
    const key = await getValueFor(firestoreSSSKey(userId))

    firebase.firestore().collection(elderlyCollectionName)
        .doc(userId).collection(keyCollectionName).doc(keyDocumentName).set({key: key})
        .catch((error) => {
            alert('Erro ao tentar criar a conta, tente novamente!')
            console.log('Error: ', error)
        })
}

/**
 * Função para obter a chave que se encontra na cloud.
 */
async function getKey(userId: string): Promise<string> {
    return firebase.firestore().collection(elderlyCollectionName)
        .doc(userId).collection(keyCollectionName).doc(keyDocumentName).get().then((doc) => {
            if(doc.exists) {
                const data = doc.data()
                return data!.key
            } 
        })
        .catch((error) => {
            alert('Erro ao tentar obter a chave, tente novamente!')
            //console.log('Error: ', error)
            return ''
        })
}

/**
 * Função para criar a coleção default para o idoso. Esta função apenas vai ser chamada uma vez,
 * respetivamente na criação da conta.
 * @returns 
 */
async function createElderly(elderlyId: string) {

    try {
        const elderlyCollectionRef = firebase.firestore().collection(elderlyCollectionName)

        //Cria na coleção o elemento do idoso.
        const novoDocumentoRef = elderlyCollectionRef.doc(elderlyId)
        novoDocumentoRef
            .set(defaultElderly)

        novoDocumentoRef
            .collection(privateCollectionName)
            .doc(privateCaregiversDocumentName)
            .set(defaultCaregivers)
    

    } catch (error) {
        alert('Erro ao tentar criar a conta, tente novamente!')
        //console.log('Error: ', error)
    }
}

export async function addCaregiverToArray(elderlyId: string, caregiverId: string, permission: string): Promise<boolean> {

    const privateCaregiverDocRef = firebase.firestore()
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(privateCollectionName).doc(privateCaregiversDocumentName)

    //Cria na coleção o elemento do idoso.
    return privateCaregiverDocRef.get().then(doc => {
        if(!doc.exists) {
            return false
        }
        const elderlyDoc = doc.data()

        if(!elderlyDoc) {
            return false
        }

        const currentArray = elderlyDoc[permission] || []
        if(!currentArray.includes(caregiverId)) {
            const newArray = [...currentArray, caregiverId]
            privateCaregiverDocRef.update({ [permission]: newArray });
        }
        
        return true
    })
    .catch(error => {
        alert('Erro ao tentar adicionar caregiver de leitura, tente novamente!')
        console.log(error)
        return false
    })
}

export async function removeCaregiverFromArray(elderlyId: string, caregiverId: string, permission: string): Promise<boolean> {

    const privateCaregiverDocRef = firebase.firestore()
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(privateCollectionName).doc(privateCaregiversDocumentName)

    // Retrieve the document
    return privateCaregiverDocRef.get().then(doc => {
        if (!doc.exists) {
            return false
        }
        const elderlyDoc = doc.data();

        if (!elderlyDoc) {
            return false
        }

        const currentArray = elderlyDoc[permission] || [];
        const newArray = currentArray.filter((id: string) => id !== caregiverId); // Remove the caregiverId from the array
        privateCaregiverDocRef.update({ [permission]: newArray });

        return true
    })
    .catch(error => {
        alert('Erro ao tentar remover caregiver, tente novamente!')
        //console.log(error)
        return false
    })
}

export async function getCaregiversArray(elderlyId: string, permission: string) {
    const privateCaregiverDocRef = firebase.firestore()
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(privateCollectionName).doc(privateCaregiversDocumentName)

    return privateCaregiverDocRef.get().then(doc => { 
        if(!doc.exists) {
            return []
        }
        const elderlyDoc = doc.data()
        
        if(!elderlyDoc) {
            return
        }

        return elderlyDoc[permission] || []
    })
    .catch((error) => {
        alert('Erro ao obter os cuidadores que conseguem ler, tente novamente!')
        //console.error('Error: ', error)
        return []
    });
}

/**
 * Esta função tem como intuito verificar se o idoso já possui dados na cloud Firestore. 
 * Retorna uma Promise com essa verificação, ou com o erro que ocorreu.
 * @param elderlyId 
 * @returns 
 */
async function elderlyExists(elderlyId: string): Promise<boolean> {
    
    return firestore.collection(elderlyCollectionName).doc(elderlyId).get()
    .then((doc) => doc.exists)
    .catch((error) => {
        //alert('Erro ao verificar se idoso existe, tente novamente!')
        console.error('Error: ', error)
        return false
    })
}

/**
 * Função para adicionar uma nova credencial à coleção pertencente ao respetivo idoso.
 * @param userId 
 * @param newCredencialId 
 * @param data 
 */
async function addCredencial(userId: string, shared: string, newCredencialId: string, data: string) {
    const key = deriveSecret([await getKey(userId), shared])
    const encrypted = encrypt(data, key)

    const credential = defaultCredencials(encrypted)

    firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(newCredencialId)
            .set(credential)
        .catch((error) => {
            alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            //console.log('Error: ', error)
        })
}

/**
 * Função para listar todos os idosos
 */
async function listAllElderly(): Promise<string[]> {
  
    return firestore.collection(elderlyCollectionName).get().then((docs) => {
        const values: string[] = []
        docs.forEach((doc) => { console.log(doc.id, ' => ', doc.data()); values.push(doc.data().caregivers) });
        return values
    }).catch((error) => {
        alert('Erro ao obter os idosos, tente novamente!')
        //console.error('Error: ', error)
        return []
    });
}

interface Credential {
    id: string,
    data: string
}

/**
 * Função para listar as credenciais de determinado utilizador
 * @param userId 
 */
async function listAllElderlyCredencials(userId: string, shared: string): Promise<Credential[]> {

    console.log("Shared: "+shared)
    const cloudKey = await getKey(userId)
    //console.log("cloudKey: "+cloudKey)
    const key = deriveSecret([cloudKey, shared])

    return firestore.collection(elderlyCollectionName).doc(userId).collection(credencialsCollectionName).get().then((docs) => {
        const values: Credential[] = []
        docs.forEach((doc) => { 
            if(doc.data()) {
                //console.log("Value: "+doc.data().data)
                const decrypted = decrypt(doc.data().data, key)
                //console.log("Key:", key)
                //console.log("Decryption: ", decrypted, '\n')
                values.push({id: doc.id, data: decrypted}) 
            }
        });
        return values
    }).catch((error) => {
        alert('Erro ao obter as credenciais, tente novamente!')
        console.log('Error: ', error.message)
        return []
    });
}

/**
 * Função para listar as propriedades de uma credencial específica
 * @param userId 
 * @param credencialId 
 */
async function listCredencialProperties(userId: string, credencialId: string) {

    firestore.collection(elderlyCollectionName)
        .doc(userId).collection(credencialsCollectionName)
            .doc(credencialId).get().then((doc) => {
                console.log(doc.id, " => ", doc.data());
        })
        .catch((error) => {
            //alert('Erro ao obter a credencial , tente novamente!')
            //console.log('Error: ', error)
        })
}

/**
 * Função para apagar uma credencial específica
 * @param credentialId 
 */
async function deleteCredential(userId: string, credentialId: string): Promise<boolean> {

    return firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(credentialId)
            .delete()
        .catch((error) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            //console.log('Error: ', error)
            return false
        }).then(() => { return true })
}

async function updateCredential(userId: string, credencialId: string, shared: string, data: string): Promise<boolean> {

    const cloudKey = await getKey(userId)
    const key = deriveSecret([cloudKey, shared])

    const encrypted = encrypt(data, key)
    
    const updatedCredencial = updateDataCredencial(encrypted)

    return firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(credencialId)
            .update(updatedCredencial)
        .catch((error) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            //console.log('Error: ', error)
            return false
        }).then(() => { return true })
}

async function initFirestore(userId: string): Promise<boolean> {
    return elderlyExists(userId).then((result) => {
        if (!result) { //se não existir
            createElderly(userId)
            //console.log('Elderly created sucessfully!!')
        }
        return true
    }).catch(error => {
        //console.log('Error initFirestore: ', error)
        return false
    });
}

export { deleteCredential, initFirestore, changeKey, getKey, listAllElderly, createElderly, addCredencial, updateCredential, listAllElderlyCredencials, /*firebaseTest*/ }