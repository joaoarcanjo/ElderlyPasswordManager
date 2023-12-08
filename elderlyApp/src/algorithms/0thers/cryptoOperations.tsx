import cryptoes from "crypto-es";
import { CipherParams, CipherParamsCfg } from "crypto-es/lib/cipher-core";
import { WordArray } from "crypto-es/lib/core";
import * as Crypto from 'expo-crypto';

const iv_size = 16

const encryption = (message: string | WordArray, key: string | WordArray, nonce: WordArray | undefined ) => {
    return cryptoes.AES.encrypt(message , key, {
        iv: nonce,
        mode: cryptoes.mode.CTR
    }).toString()
}
const decryption = (ciphertext: string | CipherParams | CipherParamsCfg, key: string | WordArray, nonce: WordArray | undefined) => {
    return cryptoes.AES.decrypt(ciphertext , key, {
        iv: nonce,
        mode: cryptoes.mode.CTR
    }).toString(cryptoes.enc.Utf8)
}

const randomIV = () => cryptoes.lib.WordArray.random(iv_size)

const wordArrayToString = (text: WordArray) => cryptoes.enc.Hex.stringify(text)
const stringToWordArray = (text: string) => cryptoes.enc.Hex.parse(text)

const getNewId = () =>  Crypto.randomUUID()

export { decryption, encryption, randomIV, wordArrayToString, stringToWordArray, getNewId }