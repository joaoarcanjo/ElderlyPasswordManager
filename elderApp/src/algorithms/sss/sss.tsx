import { HEX_ENCODING } from "./algorithm/constants";
import { saveKeychainValue, getKeychainValueFor } from './../../keychain/index'
import { caregiver1SSSKey, caregiver2SSSKey, elderlyFireKey, firestoreSSSKey } from "../../keychain/constants";
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
async function initSSS(userId: string): Promise<string> {
    console.log("===> InitSSSCalled")
    let fireKey = await getKeychainValueFor(elderlyFireKey(userId))
    //console.log("InitSSS Shared:  " + shared + " userid: " + userId)

    if(fireKey != '') return fireKey
    const key = generateKey()
    const shares: string[] = generateShares(key, 3, 2)
    //console.log(shares)
    
    await saveKeychainValue(firestoreSSSKey(userId), shares[2]+'')
    await saveKeychainValue(caregiver2SSSKey(userId), shares[1]+'')
    await saveKeychainValue(caregiver1SSSKey(userId), shares[0]+'')
    await saveKeychainValue(elderlyFireKey(userId), key)      

    return key
}

export { generateShares, deriveSecret, initSSS }


/*
HOW TO USE IT:
    const shares = generateShares("OASDM1231 31J3221O3 C231231233",3,2)
    const share = deriveSecret([shares[0], shares[1]])
    console.log(share)

    await save(firestoreSSSKey(userId), '08010042488300210001073d0055002f00d8784c176c0035676d317502533740004d777600c800586601003e007496de0066001300415463386a007532350043477f7341707d0026005a00676048007e2265004f860c6662796a8944006f00450025')
    await save(caregiver2SSSKey(userId),'08020084901b004200010e3d0055002f0046f04c2e6c0035ce6d627504536ed6004dee76007d0058ccce00f20074316b0066008f0041a863706a007564a500438e23e641e06500e3005a0067c06300444465004f11c9cc62f26a0f44006f00450080')
    await save(caregiver1SSSKey(userId),'08030053a200000f850128a79563007700ed0046c571004f0024000f004a00c100c6003d007a5ff4f032942b006dadf900d400fa0064d86a00539179006a00380066004e0073f9d2006f0065004d004b2b689e9e00f20978004d334d5c7800cd0047')
*/