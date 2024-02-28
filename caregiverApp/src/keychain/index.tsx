import {setItemAsync, getItemAsync, deleteItemAsync} from 'expo-secure-store';
import { caregiverEmail, caregiverId, localDBKey } from './constants';
import { generateKey } from '../algorithms/0thers/crypto';

/*
 * Função para armazenar o valor key-value.
 * 
 * @param key
 * @param value 
 */
async function saveKeychainValue(key: string, value: string) {
  console.log("Key: " + key + " Value: " + value)
  do {
    setItemAsync(key, value)
  } while(value != '' && await getKeychainValueFor(key) == '')
}

/**
 * Função para obter o valor correspondente a determinada chave.
 * 
 * @param key 
 */
async function getKeychainValueFor(key: string): Promise<string> {
  return getItemAsync(key).then((result) => result ?? '')
}

/**
 * 
 */
async function deleteKeychainValueFor(key: string): Promise<void> {
  return deleteItemAsync(key)
}

/**
 * Função para apagar todos os valores armazenados na keychain do dispositivo.
 * Apenas utilizado para debug, para limpar tudo.
 */
//TODO: Fazer delete de todos os outros valores que vou adicionar à keychain
async function cleanKeychain(id: string) {
  await deleteItemAsync(caregiverId)
}


/**
 * Função para inicializar a keychain, onde será armazenado na mesma o identificador
 * do utilizador.
 * Os restantes valores armazenados na keychain, acontece no init do algoritmo SSS
 * @param userId 
 * @returns 
 */
async function initKeychain(userId: string, userEmail: string): Promise<string> {

  if(await getKeychainValueFor(caregiverId) == '') {
    await cleanKeychain(userId).then(() => {
      saveKeychainValue(caregiverId, userId)
      saveKeychainValue(caregiverEmail, userEmail)
    })
  }
  if(await getKeychainValueFor(localDBKey(userId)) == '') {
    saveKeychainValue(localDBKey(userId), generateKey()) 
  }
  return await getKeychainValueFor(localDBKey(userId))
}

export { initKeychain, deleteKeychainValueFor, getKeychainValueFor, saveKeychainValue }