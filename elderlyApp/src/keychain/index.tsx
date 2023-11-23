import * as SecureStore from 'expo-secure-store';

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
  save("ola", "asd")
  console.log(await getValueFor("ola"))
}

async function initKeychain(userId: string) {
  if(await getValueFor('userId') == '') {
    save('userId', userId)
  }
}

export { getValueFor, secureStoreTest, initKeychain }