import { HEX_ENCODING } from "./algorithm/constants";
import * as Crypto from 'expo-crypto';
const { BIN_ENCODING } = require('./algorithm/constants')
const { split } = require('./algorithm/split')
const { combine } = require('./algorithm/combine')
global.Buffer = require('buffer').Buffer;
import { save } from './../../keychain/index'
import { caregiver1SSSKey, caregiver2SSSKey, elderlySSSKey, firestoreSSSKey } from "../../keychain/constants";

function generateShares(secret: string, numberOfShares:  number, threshold: number) {
    let shares = split(secret, { shares: numberOfShares, threshold: threshold })
    shares = shares.map((shares: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => Buffer.from(shares).toString(HEX_ENCODING))
    //console.log("Buffers:")
    //shares.map(share => console.log(share))
    return shares
}

function deriveSecret(shares: string[]): string {
    const recovered = combine(shares)
    return String.fromCharCode.apply(null, Array.from(recovered))
}

function initSSS() {
    const key = Crypto.getRandomBytes(32)

    const shares = generateShares(String.fromCharCode.apply(null, Array.from(key)), 4, 2)

    save(elderlySSSKey, shares[0])
    save(caregiver1SSSKey, shares[1])
    save(caregiver2SSSKey, shares[2])
    save(firestoreSSSKey, shares[3])
    
    //console.log(generateShares(String.fromCharCode.apply(null, Array.from(key)), 4, 2))
}

export { generateShares, deriveSecret, initSSS }


/*
const { generateShares, deriveSecret } = require('../../../algorithms/sss/sss')

HOW TO USE IT:
    const shares = generateShares("OASDM1231 31J3221O3 C231231233",3,2)
    const share = deriveSecret([shares[0], shares[1]])
    console.log(share)
*/