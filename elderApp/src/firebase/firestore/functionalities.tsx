import { Alert } from 'react-native';
import { encrypt } from '../../algorithms/tweetNacl/crypto';
import { elderlyCollectionName, keyCollectionName, keyDocumentName, caregiversCollectionName, caregiversDocumentName, credencialsCollectionName, emptyValue } from '../../assets/constants/constants';
import { getKeychainValueFor } from '../../keychain';
import { elderlyFireKey, firestoreSSSKey } from '../../keychain/constants';
import { firebase } from '../FirebaseConfig';
import { defaultCaregivers, defaultCredencials, defaultElderly, updateDataCredencial } from './constants';

const firestore = firebase.firestore()

/**
 * Função para alterar a chave que se encontra na cloud.
 */
async function changeFirestoreKey(userId: string) {
    console.log("===> changeFirestoreKeyCalled")
    await getKeychainValueFor(firestoreSSSKey(userId))
    .then(async (firestoreKey) => {
        await firestore.collection(elderlyCollectionName)
        .doc(userId).collection(keyCollectionName).doc(keyDocumentName).set({key: firestoreKey})
        .catch((error) => {
            //console.log('Error: ', error)
            throw new Error('Erro ao alterar a chave na firestore, tente novamente!')
        })
    })
    .catch((error) => {
        //console.log('Error: ', error)
        throw new Error('Erro ao alterar a chave na firestore, tente novamente!')
    })
}

/**
 * Função para obter a chave que se encontra na cloud.
 */
async function getKey(userId: string): Promise<string> {
    return firestore.collection(elderlyCollectionName)
        .doc(userId).collection(keyCollectionName).doc(keyDocumentName).get().then((doc) => {
            if(doc.exists) {
                const data = doc.data()
                return data!.key
            } 
        })
        .catch((error) => {
            Alert.alert("Erro", 'Erro ao tentar obter a chave, tente novamente!')
            //console.log('Error: ', error)
            return emptyValue
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
            .collection(caregiversCollectionName)
            .doc(caregiversDocumentName)
            .set(defaultCaregivers)

    } catch (error) {
        Alert.alert("Erro", 'Erro ao tentar criar a conta na firebase!')
        //console.log('Error: ', error)
    }
}

export async function addCaregiverToArray(elderlyId: string, caregiverId: string, permission: string): Promise<boolean> {
    console.log("===> addCaregiverToArrayCalled")
    const caregiverDocRef = firestore
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(caregiversCollectionName).doc(caregiversDocumentName)

    //Cria na coleção o elemento do idoso.
    return caregiverDocRef.get().then(doc => {
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
            caregiverDocRef.update({ [permission]: newArray });
        }
        return true
    })
    .catch(error => {
        Alert.alert("Erro", 'Erro ao tentar adicionar caregiver de leitura, tente novamente!')
        return false
    })
}

export async function removeCaregiverFromArray(elderlyId: string, caregiverId: string, permission: string): Promise<boolean> {

    const privateCaregiverDocRef = firestore
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(caregiversCollectionName).doc(caregiversDocumentName)

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
        Alert.alert("Erro", 'Erro ao tentar remover caregiver, tente novamente!')
        //console.log(error)
        return false
    })
}

export async function getCaregiversArray(elderlyId: string, permission: string) {
    const privateCaregiverDocRef = firestore
        .collection(elderlyCollectionName).doc(elderlyId)
        .collection(caregiversCollectionName).doc(caregiversDocumentName)

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
        Alert.alert("Erro", 'Erro ao obter os cuidadores que conseguem ler, tente novamente!')
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
    console.log("===> elderlyExistsCalled")
    return firestore.collection(elderlyCollectionName).doc(elderlyId).get()
    .then((doc) => doc.exists)
    .catch((error) => {                        
        console.log("Error 14: "+ error.message)
        return false
    })
}

/**
 * Função para adicionar uma nova credencial à coleção pertencente ao respetivo idoso.
 * @param userId 
 * @param newCredencialId 
 * @param data 
 */
export async function addCredencialToFirestore(userId: string, newCredencialId: string, data: string) {
    console.log("===> addCredencialToFirestoreCalled")
    console.log("Data: "+ data)
    const userKey = await getKeychainValueFor(elderlyFireKey(userId))
    const encrypted = encrypt(data, userKey)
    const credential = defaultCredencials(encrypted)

    firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(newCredencialId)
            .set(credential)
        .catch((error) => {
            Alert.alert("Erro", 'Erro ao tentar adicionar a nova credencial, tente novamente!')
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
        Alert.alert("Erro", 'Erro ao obter os idosos, tente novamente!')
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
async function listAllElderlyCredencials(userId: string): Promise<Credential[]> {
    return firestore.collection(elderlyCollectionName).doc(userId).collection(credencialsCollectionName).get().then((docs) => {
        const values: Credential[] = []
        docs.forEach((doc) => { 
            if(doc.data()) {
                values.push({id: doc.id, data: doc.data().data}) 
            }
        });
        return values
    }).catch((error) => {
        console.log('Error: ', error.message)
        return []
    });
}

/**
 * Função para apagar uma credencial específica
 * @param credentialId 
 */
async function deleteCredentialFromFiretore(userId: string, credentialId: string): Promise<boolean> {

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

async function updateCredentialFromFiretore(userId: string, credencialId: string, data: string): Promise<boolean> {
    console.log("===> updateCredentialFromFiretoreCalled")

    const userKey = await getKeychainValueFor(elderlyFireKey(userId))
    const encrypted = encrypt(data, userKey)
    const updatedCredencial = updateDataCredencial(encrypted)
    
    return firestore.collection(elderlyCollectionName)
        .doc(userId)
            .collection(credencialsCollectionName)
            .doc(credencialId)
            .update(updatedCredencial)
        .catch((error) => {
            //alert('Erro ao tentar adicionar a nova credencial, tente novamente!')
            console.log("Error: "+ error.message)
            return false
        }).then(() => { return true })
}

async function initFirestore(userId: string): Promise<boolean> {
    console.log("===> initFirestoreCalled")
    if(userId === emptyValue) return false
    //throw new Error("Erro ao iniciar a firestore, tente novamente!")
    return elderlyExists(userId).then(async (result) => {
        if (!result) { //se não existir
            await createElderly(userId)
            .then(() => changeFirestoreKey(userId))
            //console.log('Elderly created sucessfully!!')
        }
        return true
    }).catch(error => {
        console.log('Error: ', error.message)                        
        throw new Error("Erro ao iniciar a firestore, tente novamente!")
    });
}

async function getServerIP(): Promise<string> {
    const serverDocRef = firestore
        .collection("Server")
        .doc("server")

    return serverDocRef.get().then((doc) => {
        if (doc.exists) {
            const serverData = doc.data()
            if (serverData) return serverData.ip
        }
        return emptyValue
    }).catch((error) => {
        Alert.alert("Erro", 'Erro ao obter o IP do servidor, tente novamente!');
        console.error('Error: ', error);
        return emptyValue
    })
}

export { getServerIP, deleteCredentialFromFiretore, initFirestore, changeFirestoreKey, getKey, listAllElderly, createElderly, updateCredentialFromFiretore, listAllElderlyCredencials, /*firebaseTest*/ }