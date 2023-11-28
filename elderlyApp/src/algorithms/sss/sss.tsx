import { HEX_ENCODING } from "./algorithm/constants";
import * as Crypto from 'expo-crypto';
import { getValueFor, save } from './../../keychain/index'
import { caregiver1SSSKey, caregiver2SSSKey, elderlySSSKey, firestoreSSSKey } from "../../keychain/constants";

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
async function initSSS() {
    if(await getValueFor(elderlySSSKey) != '') return;
    const key = Crypto.getRandomBytes(32)
    const shares = generateShares(String.fromCharCode.apply(null, Array.from(key)), 4, 2)

    console.log('Elderly key: ', shares[0])
    console.log('Caregiver 1 key: ', shares[1])
    console.log('Caregiver 2 key: ', shares[2])
    console.log('Firestore key: ', shares[3], '\n\n')

    save(elderlySSSKey, shares[0])
    save(caregiver1SSSKey, shares[1])
    save(caregiver2SSSKey, shares[2])
    save(firestoreSSSKey, shares[3])
}

export { generateShares, deriveSecret, initSSS }


/*
HOW TO USE IT:
    const shares = generateShares("OASDM1231 31J3221O3 C231231233",3,2)
    const share = deriveSecret([shares[0], shares[1]])
    console.log(share)
*/