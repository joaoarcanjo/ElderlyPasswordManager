import { randomUUID } from "expo-crypto"
import { listAllCredentialsFromFirestore, postSalt, updateCredentialFromFirestore } from "../../firebase/firestore/functionalities"
import { getKeychainValueFor, saveKeychainValue } from "../../keychain"
import { caregiverFireKey, caregiverPwd } from "../../keychain/constants"
import { decrypt } from "../tweetNacl/crypto"
import { SaltCredentialDocumentName, pbkdf2Iterations } from "../../assets/constants/constants"
import { pbkdf2Sync } from "pbkdf2"
import { encodeBase64 } from "tweetnacl-util"
import { secretbox } from "tweetnacl";

export async function changeKey(userId: string) {
    const salt = randomUUID()
    postSalt(userId, salt, SaltCredentialDocumentName)
    const pwd = await getKeychainValueFor(caregiverPwd)
    const key = encodeBase64(pbkdf2Sync(pwd, salt, pbkdf2Iterations, secretbox.keyLength, 'sha256'))
    await saveKeychainValue(caregiverFireKey(userId), key)  
    return key
}

/**
 * Esta função vai executar a troca de chave, e vai atualizar todas as credenciais na cloud e localmente
 * @param userId 
 * @returns 
 */
export async function executeKeyExchange(userId: string): Promise<string> {
    console.log("===> executeKeyExchangeCalled")
    const startTime = Date.now()    
    const oldkey = await getKeychainValueFor(caregiverFireKey(userId))
    const credentialsCloud = await listAllCredentialsFromFirestore(userId, oldkey, false)
    const newKey = await changeKey(userId)
    
    try {
        credentialsCloud.forEach(async (credential) => {
            if(credential === undefined) return
            let decryptedCredential = undefined
            try { 
                decryptedCredential = decrypt(credential.data, oldkey)
            } catch (error) {
                console.log("#1 Error updating credentials after keyExchange")
            }
            if (decryptedCredential != undefined) {
                let credentialCloud = JSON.parse(decryptedCredential) 
                await updateCredentialFromFirestore(
                    userId,
                    credential.id,
                    oldkey,
                    JSON.stringify(credentialCloud),
                    false
                )
            } 
        })
    } catch (error) {
        console.log("#1 Error updating credentials after keyExchange")
    }

    const endTime = Date.now()
    const duration = endTime - startTime;
    //Alert.alert('Tempo de execução da rotatividade das chaves:', `${duration}ms`)
    return newKey
}