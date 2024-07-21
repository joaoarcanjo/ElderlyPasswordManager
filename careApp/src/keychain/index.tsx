import {setItemAsync, getItemAsync, deleteItemAsync} from 'expo-secure-store';
import { caregiverEmail, caregiverId, caregiverPwd, caregiverFireKey, localDBKey } from './constants';
import { SaltCredentialDocumentName, emptyValue, pbkdf2Iterations } from '../assets/constants/constants';
import { secretbox } from "tweetnacl";
import { pbkdf2Sync } from 'pbkdf2';
import { decode as decodeBase64, encode as encodeBase64} from '@stablelib/base64';
import { getSalt, postSalt } from '../firebase/firestore/functionalities';
import { randomUUID } from 'expo-crypto';

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
 * Função para inicializar a keychain, onde será armazenado na mesma o identificador
 * do utilizador.
 * Os restantes valores armazenados na keychain, acontece no init do algoritmo SSS
 * @param userId 
 * @returns 
 */
export async function initKeychain(userId: string, userEmail: string) {
  console.log("==> initKeychain")
  if(await getKeychainValueFor(caregiverId) !== userId) {
    await deleteKeychainValueFor(userId).then(async () => {
      await saveKeychainValue(caregiverId, userId)
      await saveKeychainValue(caregiverEmail, userEmail)
    })
  }
  let key = await getKeychainValueFor(caregiverFireKey(userId))
  if(key == emptyValue) {
    let salt = await getSalt(userId, SaltCredentialDocumentName)
    if(salt == undefined || salt == emptyValue) {
      salt = randomUUID()
      await postSalt(userId, salt, SaltCredentialDocumentName)
    }
    key = encodeBase64(pbkdf2Sync(await getKeychainValueFor(caregiverPwd), salt, pbkdf2Iterations, secretbox.keyLength, 'sha256'))
  } 
  await saveKeychainValue(caregiverFireKey(userId), key)
}