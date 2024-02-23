import {setItemAsync, getItemAsync, deleteItemAsync} from 'expo-secure-store';

/*
 * Função para armazenar o valor key-value.
 * 
 * @param key
 * @param value 
 */
async function saveKeychainValue(key: string, value: string) {
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

export { deleteKeychainValueFor, getKeychainValueFor, saveKeychainValue }