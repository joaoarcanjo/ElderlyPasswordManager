import { deriveSecret } from '../../algorithms/sss/sss';
import { getValueFor } from '../../keychain';
import { elderlyId, elderlySSSKey, firestoreSSSKey } from '../../keychain/constants';
import { firebase } from '../FirebaseConfig';
import { credencialsCollectionName, defaultCredencials, defaultElderly, elderlyCollectionName } from './constants';
import cryptoes from "crypto-es";

const firestore = firebase.firestore()

/**
 * Função para alterar a chave que se encontra na cloud.
 */
async function changeKey() {

    const userId = await getValueFor(elderlyId)
    const key = await getValueFor(firestoreSSSKey)

    console.log('UserId: ', userId)
    firebase.firestore().collection(elderlyCollectionName)
        .doc(userId).update({key: key})
        .catch((error) => {
            alert('Erro ao tentar criar a conta, tente novamente!')
            console.log('Error: ', error)
        })
}

/**
 * Função para obter a chave que se encontra na cloud.
 */
async function getKey(): Promise<string> {

    const userId = await getValueFor(elderlyId)

    return firebase.firestore().collection(elderlyCollectionName)
        .doc(userId).get().then((doc) => {
            if(doc.exists) {
                const data = doc.data()
                return data!.key
            }
        })
        .catch((error) => {
            //alert('Erro ao tentar obter a chave, tente novamente!')
            console.log('Error: ', error)
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
        novoDocumentoRef.set(defaultElderly)
    
        //Cria a subcoleção credenciais e adiciona um valor default.
       // novoDocumentoRef.collection(credencialsCollectionName)
            //.doc('defaultCredencial').set(defaultCredencials("defaultData"))

    } catch (error) {
        alert('Erro ao tentar criar a conta, tente novamente!')
        console.log('Error: ', error)
    }
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
async function addCredencial(newCredencialId: string, data: string) {

    const userId = await getValueFor(elderlyId)

    const key = deriveSecret([await getKey(), await getValueFor(elderlySSSKey)])
    console.log("Add credencial key: ",key)
    const encrypted = cryptoes.AES.encrypt(data , key).toString();

    //console.log("Key:", key)
    //console.log("Encryption:", encrypted)

    console.log(encrypted)
    const defaultCredencial = defaultCredencials(encrypted)

    firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(newCredencialId)
            .set(defaultCredencial)
        .catch((error) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
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
        //alert('Erro ao obter os idosos, tente novamente!')
        console.error('Error: ', error)
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
async function listAllElderlyCredencials(): Promise<Credential[]> {

    const userId = await getValueFor(elderlyId)

    const key = deriveSecret([await getKey(), await getValueFor(elderlySSSKey)])


    return firestore.collection(elderlyCollectionName).doc(userId).collection(credencialsCollectionName).get().then((docs) => {
        const values: Credential[] = []
        docs.forEach((doc) => { 
            if(doc.data()) {
                console.log(doc.id)
                console.log(doc.data())
                console.log("Key:", key)
                console.log("Decryption: ", cryptoes.AES.decrypt(doc.data().data , key).toString(cryptoes.enc.Utf8), '\n')
            }
            values.push({'id': doc.id, 'data': cryptoes.AES.decrypt(doc.data().data , key).toString(cryptoes.enc.Utf8)}) 
        });
        return values
    }).catch((error) => {
        //alert('Erro ao obter as credenciais, tente novamente!')
        console.log('Error: ', error)
        return []
    });
}

/**
 * Função para listar as propriedades de uma credencial específica
 * @param userId 
 * @param credencialId 
 */
async function listCredencialProperties(credencialId: string) {

    const userId = await getValueFor(elderlyId)

    firestore.collection(elderlyCollectionName)
        .doc(userId).collection(credencialsCollectionName)
            .doc(credencialId).get().then((doc) => {
                console.log(doc.id, " => ", doc.data());
        })
        .catch((error) => {
            //alert('Erro ao obter a credencial , tente novamente!')
            console.log('Error: ', error)
        })
}

async function deleteCredential(credentialId: string) {
    
    const userId = await getValueFor(elderlyId)

    firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(credentialId)
            .delete()
        .catch((error) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log('Error: ', error)
        })
}

async function initFirestore(): Promise<boolean> {

    const id = await getValueFor(elderlyId)

    return elderlyExists(id).then((result) => {
        if (!result) { //se não existir
            createElderly(id)
            console.log('Elderly created sucessfully!!')
        }
        return true
    }).catch(error => {
        console.log('Error initFirestore: ', error)
        return false
    });
}

export { deleteCredential, initFirestore, changeKey, getKey, listAllElderly, createElderly, addCredencial, listAllElderlyCredencials, /*firebaseTest*/ }