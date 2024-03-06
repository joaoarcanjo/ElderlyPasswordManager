import { decrypt, encrypt } from '../../algorithms/0thers/crypto';
import { deriveSecret } from '../../algorithms/sss/sss';
import { firebase } from '../FirebaseConfig';
import { caregiversCollectionName, caregiversDocumentName, credencialsCollectionName, defaultCredencials, elderlyCollectionName, keyCollectionName, keyDocumentName, updateDataCredencial } from './constants';

const firestore = firebase.firestore()

/**
 * Função para obter a chave que se encontra na cloud.
 */
async function getKey(elderlyId: string): Promise<string> {
    return firebase.firestore().collection(elderlyCollectionName)
        .doc(elderlyId).collection(keyCollectionName).doc(keyDocumentName).get().then((doc: any) => {
            if(doc.exists) {
                const data = doc.data()
                return data!.key
            } 
        })
        .catch((error: any) => {
            alert('Erro ao tentar obter a chave, tente novamente!')
           console.log('Error: ', error)
            return ''
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
    console.log(credential)
    await firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(newCredencialId)
            .set(credential)
        .catch((error: any) => {
            alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
        })
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

    const cloudKey = await getKey(userId)
    const key = deriveSecret([cloudKey, shared])

    return firestore.collection(elderlyCollectionName).doc(userId).collection(credencialsCollectionName).get().then((docs: any) => {
        const values: Credential[] = []
        docs.forEach((doc: any) => { 
            if(doc.data()) {
                const decrypted = decrypt(doc.data().data, key)
                values.push({'id': doc.id, 'data': decrypted}) 
            }
        });
        return values
    }).catch((error: any) => {
        alert('Erro ao obter as credenciais, tente novamente!')
        //console.log('Error: ', error)
        return []
    });
}

/**
 * Função para apagar uma credencial específica
 * @param credentialId 
 */
async function deleteCredential(elderlyId: string, credentialId: string): Promise<boolean> {

    return firestore.collection(elderlyCollectionName)
        .doc(elderlyId)
            .collection(credencialsCollectionName)
            .doc(credentialId)
            .delete()
        .catch((error: any) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
            return false
        }).then(() => { return true })
}

async function updateCredential(elderlyId: string, credencialId: string, shared: string, data: string): Promise<boolean> {
    const cloudKey = await getKey(elderlyId)
    const key = deriveSecret([cloudKey, shared])
    const encrypted = encrypt(data, key) 
    
    const updatedCredencial = updateDataCredencial(encrypted)
    console.log(updatedCredencial)
    return firestore.collection(elderlyCollectionName)
        .doc(elderlyId)
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
    const privateCaregiverDocRef = firebase.firestore()
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
        alert('Erro ao obter os cuidadores que conseguem ler, tente novamente!')
        console.error('Error: ', error)
        return []
    });
}
/*
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
}*/

export { deleteCredential, getKey, addCredencial, updateCredential, listAllElderlyCredencials, /*firebaseTest*/ }