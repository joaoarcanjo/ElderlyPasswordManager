import * as SecureStore from 'expo-secure-store';
import { elderlySSSKey } from './constants';

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

  return SecureStore.getItemAsync(key).then((result) => {
    if (result != null) {
      //alert("🔐 Here's your value 🔐 \n" + result);
      return result;
    } else {
      //alert('No values stored under that key.');
      return '';
    }
  });
}

async function secureStoreTest() {
  //save(elderlySSSKey, '')
  
  save("ola", "asd")
  console.log(await getValueFor(elderlySSSKey))
}

async function initKeychain(userId: string): Promise<boolean> {
  if(await getValueFor('userId') == '') {
    save('userId', userId)
  }
  return true
}

export { getValueFor, secureStoreTest, initKeychain, save };