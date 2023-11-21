import { firebase } from '../FirebaseConfig';
import * as Crypto from 'expo-crypto';
import { credencialsCollectionName, defaultCredencials, defaultElderly, elderlyCollectionName } from './constants';

const firestore = firebase.firestore()

/**
 * Função para criar a coleção default para o idoso. Esta função apenas vai ser chamada uma vez,
 * respetivamente na criação da conta.
 * @returns 
 */
async function createElderly(): Promise<string> {
    //RandomUUID que vai ser futuramente apagado e substituido pelo ID do idoso.
    const randomUUID = Crypto.randomUUID()

    try {
        const elderlyCollectionRef = firebase.firestore().collection(elderlyCollectionName)

        //Cria na coleção o elemento do idoso.
        const novoDocumentoRef = elderlyCollectionRef.doc(randomUUID)
        novoDocumentoRef.set(defaultElderly)
    
        //Cria a subcoleção credenciais e adiciona um valor default.
        novoDocumentoRef.collection(credencialsCollectionName)
            .doc('defaultCredencial').set(defaultCredencials("defaultData"))

    } catch (error) {
        alert('Erro ao tentar criar a conta, tente novamente!')
        console.log('Error: ', error)
    }

    return randomUUID
}

/**
 * Função para adicionar uma nova credencial à coleção pertencente ao respetivo idoso.
 * @param userId 
 * @param newCredencialId 
 * @param data 
 */
async function addCredencial(userId: string, newCredencialId: string, data: string) {

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
async function listAllElderly() {
  
    firestore.collection(elderlyCollectionName).get().then((docs) => {
        docs.forEach((doc) => { console.log(doc.id, ' => ', doc.data()); });
    }).catch((error) => {
        alert('Erro ao obter os idosos, tente novamente!')
      console.error('Error: ', error);
    });
}

/**
 * Função para listar as credenciais de determinado utilizador
 * @param userId 
 */
async function listAllElderlyCredencials(userId: string) {

    firestore.collection(elderlyCollectionName)
        .doc(userId).collection(credencialsCollectionName)
        .get().then((docs) => {
            docs.forEach((doc) =>  {
                console.log(doc.id, " => ", doc.data());
            })
        })
        .catch((error) => {
            alert('Erro ao obter as credenciais, tente novamente!')
            console.log('Error: ', error)
        })
}

/**
 * Função para listar as propriedades de um determinado idoso
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
            alert('Erro ao obter a credencial , tente novamente!')
            console.log('Error: ', error)
        })
}

function firebaseTest() {

    createElderly().then(id => {
        addCredencial(id, "instagram", "{username: joao__arcanjo, password: 1234}"); 
        //listAllElderlyCredencials(id)
        listCredencialProperties(id, 'instagram')
    })
    //listAllElderly()
}

export { listAllElderly, createElderly, addCredencial, listAllElderlyCredencials, firebaseTest }