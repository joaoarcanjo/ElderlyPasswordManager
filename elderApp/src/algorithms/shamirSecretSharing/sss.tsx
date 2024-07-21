import { HEX_ENCODING } from "./algorithm/constants";
import { saveKeychainValue, getKeychainValueFor } from './../../keychain/index'
import { caregiver1SSSKey, caregiver2SSSKey, elderlyFireKey, elderlyPwd, elderlySalt, firestoreSSSKey } from "../../keychain/constants";
import { SaltCredentialDocumentName, emptyValue, pbkdf2Iterations } from "../../assets/constants/constants";
import { getSalt, postSalt } from "../../firebase/firestore/functionalities";
import { randomUUID } from "expo-crypto";
import { encodeBase64 } from "tweetnacl-util";
import { secretbox } from "tweetnacl";
import { pbkdf2Sync } from 'pbkdf2';

const { split } = require('./algorithm/split')
const { combine } = require('./algorithm/combine')

global.Buffer = require('buffer').Buffer;

/**
 * Esta função, recebendo o segredo, vai retornar os shares pretendidos, tendo em conta
 * o threshold estabelecido.
 * @param secret 
 * @param numberOfShares 
 * @param threshold 
 * @returns 
 */
export function generateShares(secret: string, numberOfShares: number, threshold: number) {
    let shares = split(secret, { shares: numberOfShares, threshold: threshold })
    shares = shares.map((shares: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => Buffer.from(shares).toString(HEX_ENCODING))
    return shares
}

/**
 * Esta função vai inicializar o algoritmo SSS caso este ainda não o tenha sido inicializado.
 * @param userId
 * @returns 
 */
export async function initSSS(userId: string, fireKey: string): Promise<string> {
    console.log("===> InitSSSCalled")

    if(fireKey == emptyValue) {
        let salt = await getSalt(userId, SaltCredentialDocumentName)
        if(salt == undefined || salt == emptyValue) {
            salt = randomUUID()
            postSalt(userId, salt, SaltCredentialDocumentName)
        }
        await saveKeychainValue(elderlySalt(userId), salt)
        //const password = await getKeychainValueFor(elderlyPwd)
        //const saltLookAlike = await arrayLookAlikeFromString(salt)
        //const passwordLookAlike = await arrayLookAlikeFromString(password)
        //const key = encodeBase64(await scrypt(passwordLookAlike, saltLookAlike, 2048, 8, 1, secretbox.keyLength))
        const pwd = await getKeychainValueFor(elderlyPwd)
        const key = encodeBase64(pbkdf2Sync(pwd, salt, pbkdf2Iterations, secretbox.keyLength, 'sha256'))

        const shares: string[] = generateShares(key, 3, 2)
        //console.log(shares)
    
        await saveKeychainValue(firestoreSSSKey(userId), shares[2])
        await saveKeychainValue(caregiver2SSSKey(userId), shares[1])
        await saveKeychainValue(caregiver1SSSKey(userId), shares[0])
        await saveKeychainValue(elderlyFireKey(userId), key)        

        console.log("FIREKEY: ",key)
        return key
    }
    return fireKey
}