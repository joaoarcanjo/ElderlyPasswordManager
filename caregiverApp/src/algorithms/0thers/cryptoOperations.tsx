import cryptoes from "crypto-es";
import { CipherParams, CipherParamsCfg } from "crypto-es/lib/cipher-core";
import { WordArray } from "crypto-es/lib/core";

//ESTAS FUNÇÕES JA NAO SAO UTILIZADAS
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

export { decryption, encryption }