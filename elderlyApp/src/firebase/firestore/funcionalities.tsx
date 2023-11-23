import { getNewId } from '../../algorithms/0thers/randomUUID';
import { getValueFor } from '../../keychain';
import { userIdKey } from '../../keychain/constants';
import { firebase } from '../FirebaseConfig';
import { credencialsCollectionName, defaultCredencials, defaultElderly, elderlyCollectionName } from './constants';

const firestore = firebase.firestore()

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
        novoDocumentoRef.collection(credencialsCollectionName)
            .doc('defaultCredencial').set(defaultCredencials("defaultData"))

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
        alert('Erro ao verificar se idoso existe, tente novamente!')
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

    const userId = await getValueFor(userIdKey)
    const defaultCredencial = defaultCredencials(data)

    firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(newCredencialId)
            .set(defaultCredencial)
        .catch((error) => {
            alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
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
        alert('Erro ao obter os idosos, tente novamente!')
        console.error('Error: ', error)
        return []
    });
}

/**
 * Função para listar as credenciais de determinado utilizador
 * @param userId 
 */
async function listAllElderlyCredencials(): Promise<string[]> {

    const userId = await getValueFor(userIdKey)

    return firestore.collection(elderlyCollectionName).doc(userId).collection(credencialsCollectionName).get().then((docs) => {
        const values: string[] = []
        docs.forEach((doc) => { console.log(doc.id, ' => ', doc.data()); values.push(doc.data().data) });
        return values
    }).catch((error) => {
        alert('Erro ao obter as credenciais, tente novamente!')
        console.log('Error: ', error)
        return []
    });
}

/**
 * Função para listar as propriedades de um determinado idoso
 * @param userId 
 * @param credencialId 
 */
async function listCredencialProperties(credencialId: string) {

    const userId = await getValueFor(userIdKey)

    firestore.collection(elderlyCollectionName)
        .doc(userId).collection(credencialsCollectionName)
            .doc(credencialId).get().then((doc) => {
                console.log(doc.id, " => ", doc.data());
        })
        .catch((error) => {
            alert('Erro ao obter a credencial , tente novamente!')
            console.log('Error: ', error)
        })
}
/*
function firebaseTest() {

    const userId = getNewId()

    createElderly(userId).then(() => {
        addCredencial("instagram", "{username: joao__arcanjo, password: 1234}"); 
        //listAllElderlyCredencials(id)
        listCredencialProperties('instagram')
    })
    //listAllElderly()
}*/

function initFirestore(elderlyId: string) {

    elderlyExists(elderlyId).then((result) => {
        if(!result) { //se não existir
            createElderly(elderlyId)
            console.log('Elderly created.')
        }
    })
}

export { initFirestore, listAllElderly, createElderly, addCredencial, listAllElderlyCredencials, /*firebaseTest*/ }