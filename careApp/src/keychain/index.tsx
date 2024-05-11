import {setItemAsync, getItemAsync, deleteItemAsync} from 'expo-secure-store';
import { caregiverEmail, caregiverId, localDBKey } from './constants';
import { generateKey } from '../algorithms/tweetNacl/crypto';
import { emptyValue } from '../assets/constants/constants';

/*
 * Função para armazenar o valor key-value.
 * 
 * @param key
 * @param value 
 */
export async function saveKeychainValue(key: string, value: string) {
  let auxKey = key
  if(key.indexOf('@') > -1) {
    auxKey = key.replace('@', '_')
  }
  do {
    await setItemAsync(auxKey, value)
  } while(value != emptyValue && await getKeychainValueFor(auxKey) == emptyValue)
}

/**
 * Função para obter o valor correspondente a determinada chave.
 * 
 * @param key 
 */
export async function getKeychainValueFor(key: string): Promise<string> {
  let auxKey = key
  if(key.indexOf('@') > -1) {
    auxKey = key.replace('@', '_')
  }
  return await getItemAsync(auxKey).then((result) => result ?? emptyValue)
}

/**
 * 
 */
export async function deleteKeychainValueFor(key: string): Promise<void> {
  return await deleteItemAsync(key)
}

/**
 * Função para apagar todos os valores armazenados na keychain do dispositivo.
 * Apenas utilizado para debug, para limpar tudo.
 */
export async function cleanKeychain(id: string) {
  await deleteItemAsync(caregiverId)
}


/**
 * Função para inicializar a keychain, onde será armazenado na mesma o identificador
 * do utilizador.
 * Os restantes valores armazenados na keychain, acontece no init do algoritmo SSS
 * @param userId 
 * @returns 
 */
export async function initKeychain(userId: string, userEmail: string): Promise<string> {
  if(await getKeychainValueFor(caregiverId) !== userId) {
    await cleanKeychain(userId).then(async () => {
      await saveKeychainValue(caregiverId, userId)
      await saveKeychainValue(caregiverEmail, userEmail)
    })
  }
  if(await getKeychainValueFor(localDBKey(userId)) == emptyValue) {
    await saveKeychainValue(localDBKey(userId), generateKey()) 
  }
  return await getKeychainValueFor(localDBKey(userId))
}