import * as SecureStore from 'expo-secure-store';
import { caregiver1SSSKey, caregiver2SSSKey, elderlyEmail, elderlyId, elderlySSSKey, firestoreSSSKey, localDBKey } from './constants';
import * as Crypto from 'expo-crypto';
/**
 * Função para armazenar o valor key-value.
 * 
 * @param key
 * @param value 
 */
async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

/**
 * Função para obter o valor correspondente a determinada chave.
 * 
 * @param key 
 */
async function getValueFor(key: string): Promise<string> {
  return SecureStore.getItemAsync(key).then((result) => result ?? ''
  );
}

/**
 * Função para apagar todos os valores armazenados na keychain do dispositivo.
 * Apenas utilizado para debug, para limpar tudo.
 */
async function cleanKeychain() {
  await SecureStore.deleteItemAsync(firestoreSSSKey)
  .then(() => SecureStore.deleteItemAsync(elderlySSSKey))
  .then(() => SecureStore.deleteItemAsync(caregiver1SSSKey))
  .then(() => SecureStore.deleteItemAsync(caregiver2SSSKey))
  .then(() => SecureStore.deleteItemAsync(elderlyId))
}

/**
 * Função para inicializar a keychain, onde será armazenado na mesma o identificador
 * do utilizador.
 * Os restantes valores armazenados na keychain, acontece no init do algoritmo SSS
 * @param userId 
 * @returns 
 */
async function initKeychain(userId: string, userEmail: string): Promise<boolean> {
  if(await getValueFor(elderlyId) == '') {
    await cleanKeychain().then(() => {
      save(elderlyId, userId)
      save(elderlyEmail, userEmail)
    })
  }
  if(await getValueFor(localDBKey) == '') {
    save(localDBKey, String.fromCharCode.apply(null, Array.from(Crypto.getRandomBytes(32)))) 
  }
  return true
}

export { getValueFor, cleanKeychain, initKeychain, save };