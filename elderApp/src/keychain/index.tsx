import {setItemAsync, getItemAsync, deleteItemAsync} from 'expo-secure-store';
import { caregiver1SSSKey, elderlyEmail, elderlyId, elderlyFireKey, firestoreSSSKey, localDBKey, caregiver2SSSKey } from './constants';
import { generateKey } from '../algorithms/0thers/crypto';
/**
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
  } while(value != '' && await getKeychainValueFor(auxKey) == '')
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
  return await getItemAsync(auxKey).then((result) => result ?? '')
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
  await deleteItemAsync(firestoreSSSKey(id))
  .then(() => deleteItemAsync(elderlyFireKey(id)))
  .then(() => deleteItemAsync(caregiver1SSSKey(id)))
  .then(() => deleteItemAsync(caregiver2SSSKey(id)))
  .then(() => deleteItemAsync(elderlyId))
}

/**
 * Função para inicializar a keychain, onde será armazenado na mesma o identificador
 * do utilizador.
 * Os restantes valores armazenados na keychain, acontece no init do algoritmo SSS
 * @param userId 
 * @returns 
 */
export async function initKeychain(userId: string, userEmail: string): Promise<void> {
  console.log("===> InitkeychainCalled")
  if(await getKeychainValueFor(elderlyId) !== userId) {
    await saveKeychainValue(elderlyId, userId)
    .then(() => saveKeychainValue(elderlyEmail, userEmail)) 
  }
}