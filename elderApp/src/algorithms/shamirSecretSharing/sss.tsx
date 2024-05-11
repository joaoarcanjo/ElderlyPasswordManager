import { HEX_ENCODING } from "./algorithm/constants";
import { saveKeychainValue, getKeychainValueFor } from './../../keychain/index'
import { caregiver1SSSKey, caregiver2SSSKey, elderlyFireKey, firestoreSSSKey } from "../../keychain/constants";
import { generateKey } from "../tweetNacl/crypto";
import { emptyValue } from "../../assets/constants/constants";

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
 * Esta função, ao receber um array de shares, vai retornar o segredo que é possível
 * obter a partir dos mesmos.
 * @param shares 
 * @returns 
 */
export function deriveSecret(shares: string[]): string {
    const recovered = combine(shares)
    return String.fromCharCode.apply(null, Array.from(recovered))
}

/**
 * Esta função vai inicializar o algoritmo SSS caso este ainda não o tenha sido inicializado.
 * @param userId
 * @returns 
 */
export async function initSSS(userId: string): Promise<string> {
    console.log("===> InitSSSCalled")
    let fireKey = await getKeychainValueFor(elderlyFireKey(userId))
    //console.log("InitSSS Shared:  " + shared + " userid: " + userId)

    if(fireKey != emptyValue) return fireKey
    const key = generateKey()
    const shares: string[] = generateShares(key, 3, 2)
    //console.log(shares)
    
    await saveKeychainValue(firestoreSSSKey(userId), shares[2])
    await saveKeychainValue(caregiver2SSSKey(userId), shares[1])
    await saveKeychainValue(caregiver1SSSKey(userId), shares[0])
    await saveKeychainValue(elderlyFireKey(userId), key)      

    return key
}