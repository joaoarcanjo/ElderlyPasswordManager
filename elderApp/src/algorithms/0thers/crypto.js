import { secretbox, randomBytes, setPRNG } from "tweetnacl";
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8';
import { decode as decodeBase64, encode as encodeBase64} from '@stablelib/base64';
import { getRandomBytes, randomUUID } from 'expo-crypto';
import { Errors } from "../../exceptions/types";
import { ErrorInstance } from "../../exceptions/error";

setPRNG((x, n) => {
  const randomBytes = getRandomBytes(n)
  for (let i = 0; i < n; i++) {
    x[i] = randomBytes[i]
  }
})

const newNonce = () => randomBytes(secretbox.nonceLength)

const generateKey = () => encodeBase64(randomBytes(secretbox.keyLength))

/**
 * Função para encriptar a menssagem com determinada chave
 * @param {String} message 
 * @param {String} key 
 * @returns 
 */
const encrypt = (message, key) => {
  const keyUint8Array = decodeBase64(key)
  const nonce = newNonce()
  const messageUint8 = encodeUTF8(message)
  const box = secretbox(messageUint8, nonce, keyUint8Array)
  const fullMessage = new Uint8Array(nonce.length + box.length)
  fullMessage.set(nonce)
  fullMessage.set(box, nonce.length)

  const base64FullMessage = encodeBase64(fullMessage)
  return base64FullMessage
}

/**
 * Função para decifrar uma mensagem com nonce, através de determinada key
 * @param {*} messageWithNonce 
 * @param {*} key 
 * @returns 
 */
const decrypt = (messageWithNonce, key) => {
  const keyUint8Array = decodeBase64(key)
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength)

  const message = messageWithNonceAsUint8Array.slice(
    secretbox.nonceLength,
    messageWithNonce.length
  )

  const decrypted = secretbox.open(message, nonce, keyUint8Array)

  if (!decrypted) {
    throw new ErrorInstance(Errors.ERROR_INVALID_MESSAGE_OR_KEY)
  }

  const base64DecryptedMessage = decodeUTF8(decrypted)
  return base64DecryptedMessage
  //return JSON.parse(base64DecryptedMessage)
}

const getNewId = () => randomUUID()

export { generateKey, encrypt, decrypt, getNewId }