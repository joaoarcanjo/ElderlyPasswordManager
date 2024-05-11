import { emptyValue, keyRefreshTimeout, numberOfShares, threshold } from "../../assets/constants/constants"
import { getTimeoutFromLocalDB, insertTimeoutToLocalDB, updateTimeoutToLocalDB } from "../../database/timeout"
import { TimeoutType } from "../../database/types"
import { changeFirestoreKey, listAllElderlyCredencials, updateCredentialFromFiretore } from "../../firebase/firestore/functionalities"
import { getKeychainValueFor, saveKeychainValue } from "../../keychain"
import { caregiver1SSSKey, caregiver2SSSKey, firestoreSSSKey, elderlyFireKey } from "../../keychain/constants"
import { decrypt, generateKey } from "../tweetNacl/crypto"
import { sendShares } from "./sendShares"
import { generateShares } from "./sss"

/**
 * Vai gerar os novos shares, vai enviar para todos os cuidadores (2 max) o seu novo share, e vai atualizar o share na cloud.
 * @param userId - The user ID.
 * @returns The new shared secret.
 */
export async function changeKey(userId: string): Promise<string> {
    console.log("===> changeKeyCalled")
    const key = generateKey()
    //console.log("New key: ", key)
    const shares: string[] = generateShares(key, numberOfShares, threshold)
    //console.log(shares)
   
    const caregiver1Key = shares[2]
    const caregiver2Key = shares[1]
    const firestoreKey = shares[0]
    await saveKeychainValue(caregiver1SSSKey(userId), caregiver1Key)
    await saveKeychainValue(caregiver2SSSKey(userId), caregiver2Key)
    await saveKeychainValue(firestoreSSSKey(userId), firestoreKey)
    await saveKeychainValue(elderlyFireKey(userId), key)  

    await sendShares(userId, caregiver1Key, caregiver2Key)
    await changeFirestoreKey(userId)
    return key
}

/**
 * Esta função vai verificar se o tempo de timeout já passou, e se sim, vai executar a troca de chave.
 * @param userId 
 * @returns 
 */
export async function executeKeyChangeIfTimeout(userId: string): Promise<string> {
    console.log("===> executeKeyChangeIfTimeoutCalled")
    const timer = await getTimeoutFromLocalDB(userId, TimeoutType.SSS)
    if(timer == null) {
        await insertTimeoutToLocalDB(userId, new Date().getTime(), TimeoutType.SSS)
        .catch(() => console.log("#1 Error inserting timeout"))
        return emptyValue
    }

    const currentDate = new Date().getTime()
    if (currentDate - timer > keyRefreshTimeout) {
        return await updateTimeoutToLocalDB(userId, currentDate, TimeoutType.SSS)
        .then(() => {return executeKeyExchange(userId) })
        .catch(() => {
            console.log("#1 Error inserting timeout")
            return emptyValue
        })
    }
    return emptyValue
}

/**
 * Esta função vai executar a troca de chave, e vai atualizar todas as credenciais na cloud.
 * @param userId 
 * @returns 
 */
export async function executeKeyExchange(userId: string): Promise<string> {
    console.log("===> executeKeyExchangeCalled")
    const oldkey = await getKeychainValueFor(elderlyFireKey(userId))
    const credentialsCloud = await listAllElderlyCredencials(userId)
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
                await updateCredentialFromFiretore(
                    userId,
                    credential.id,
                    JSON.stringify(credentialCloud)
                )
            } 
        })
    } catch (error) {
        console.log("#1 Error updating credentials after keyExchange")
    }
    return newKey
}