import { HEX_ENCODING } from "./algorithm/constants";
import * as Crypto from 'expo-crypto';
import { getValueFor, save } from './../../keychain/index'
import { caregiver1SSSKey, caregiver2SSSKey, elderlySSSKey, firestoreSSSKey } from "../../keychain/constants";
import { generateKey } from "../0thers/crypto";

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
function generateShares(secret: string, numberOfShares: number, threshold: number) {
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
function deriveSecret(shares: string[]): string {
    const recovered = combine(shares)
    return String.fromCharCode.apply(null, Array.from(recovered))
}

/**
 * Esta função vai inicializar o algoritmo SSS caso este ainda não o tenha sido inicializado.
 * Por agora, apenas é utilizado na instalação da app do idoso.
 * @returns 
 */
async function initSSS(userId: string) {
    
    let shared = await getValueFor(elderlySSSKey(userId))
    //console.log("InitSSS Shared:  " + shared)

    if(shared != '') return shared

    const key = generateKey()
    const shares = generateShares(key, 4, 2)

    return await save(firestoreSSSKey(userId), shares[3])
    .then(() => save(caregiver2SSSKey(userId), shares[2]))
    .then(() => save(caregiver1SSSKey(userId), shares[1]))
    .then(() => save(elderlySSSKey(userId), shares[0]))
    .then(async () => await getValueFor(elderlySSSKey(userId)))
}

export { generateShares, deriveSecret, initSSS }


/*
HOW TO USE IT:
    const shares = generateShares("OASDM1231 31J3221O3 C231231233",3,2)
    const share = deriveSecret([shares[0], shares[1]])
    console.log(share)
*/