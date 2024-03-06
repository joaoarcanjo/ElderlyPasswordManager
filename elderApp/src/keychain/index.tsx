import {setItemAsync, getItemAsync, deleteItemAsync} from 'expo-secure-store';
import { caregiver1SSSKey, elderlyEmail, elderlyId, elderlySSSKey, firestoreSSSKey, localDBKey, caregiver2SSSKey } from './constants';
import { generateKey } from '../algorithms/0thers/crypto';
/**
 * Função para armazenar o valor key-value.
 * 
 * @param key
 * @param value 
 */
async function save(key: string, value: string) {
  do {
    await setItemAsync(key, value)
  } while(value != '' && await getValueFor(key) == '')
}

/**
 * Função para obter o valor correspondente a determinada chave.
 * 
 * @param key 
 */
async function getValueFor(key: string): Promise<string> {
  return await getItemAsync(key).then((result) => result ?? '')
}

/**
 * Função para apagar todos os valores armazenados na keychain do dispositivo.
 * Apenas utilizado para debug, para limpar tudo.
 */
async function cleanKeychain(id: string) {

  await deleteItemAsync(firestoreSSSKey(id))
  .then(() => deleteItemAsync(elderlySSSKey(id)))
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
async function initKeychain(userId: string, userEmail: string): Promise<string> {

  if(await getValueFor(elderlyId) !== userId) {
    await cleanKeychain(userId).then(async () => {
      await save(elderlyId, userId).then(async () => {
        await save(elderlyEmail, userEmail) 
      }) 
    })
  }
  if(await getValueFor(localDBKey(userId)) == '') {
    await save(localDBKey(userId), generateKey()) 
  }
  return await getValueFor(localDBKey(userId))
}

export { getValueFor, cleanKeychain, initKeychain, save };