/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    StorageType,
    Direction,
    SessionRecordType,
    SignalProtocolAddress,
    PreKeyPairType,
    SignedPreKeyPairType,
} from '@privacyresearch/libsignal-protocol-typescript'
import { deleteKeychainValueFor, getKeychainValueFor, saveKeychainValue } from '../../keychain'
import { decode, encode } from '@stablelib/base64'

// Type guards
export function isKeyPairType(kp: any): kp is KeyPairType {
    return !!(kp?.privKey && kp?.pubKey)
}

export function isPreKeyType(pk: any): pk is PreKeyPairType {
    return typeof pk?.keyId === 'number' && isKeyPairType(pk?.keyPair)
}

export function isSignedPreKeyType(spk: any): spk is SignedPreKeyPairType {
    return spk?.signature && isPreKeyType(spk)
}

interface KeyPairType {
    pubKey: ArrayBuffer
    privKey: ArrayBuffer
}

interface KeyPairTypeString {
    pubKey: string
    privKey: string
}

interface PreKeyType {
    keyId: number
    keyPair: KeyPairType
}

interface SignedPreKeyType extends PreKeyType {
    signature: ArrayBuffer
}

function isArrayBuffer(thing: StoreValue): boolean {
    const t = typeof thing
    return !!thing && t !== 'string' && t !== 'number' && 'byteLength' in (thing as any)
}

type StoreValue =  string | number | KeyPairType | PreKeyType | SignedPreKeyType | ArrayBuffer | undefined
type StoreValue2 =  string | number

export class SignalProtocolStore implements StorageType {
    private _store2: Record<string, StoreValue2>

    constructor() {
        this._store2 = {}
    }

    async get2(key: string, defaultValue: StoreValue2): Promise<StoreValue2> {
        if (key === null || key === undefined) throw new Error('Tried to get value for undefined/null key')
        if (key in this._store2) {
            return this._store2[key]
        } else {
            //console.log(`Key "${key}" not in store`)
            const value = await getKeychainValueFor(key)
            if(value) {
                this._store2[key] = value
                return value
            }
            return defaultValue
        }
    }

    remove2(key: string): void {
        if (key === null || key === undefined) throw new Error('Tried to remove value for undefined/null key')
        delete this._store2[key]
        deleteKeychainValueFor(key)
    }

    async put2(key: string, value: StoreValue2): Promise<void> {
        if (key === undefined || value === undefined || key === null || value === null)
            throw new Error('Tried to store undefined/null')

        saveKeychainValue(key, value +'')
        this._store2[key] = value
    }

    async getIdentityKeyPair(): Promise<KeyPairType | undefined> {
        console.log('//getIdentityKeyPair')
        const kPub = await this.get2('identityIdPubKey', '')
        const kPriv = await this.get2('identityIdPrivKey', '')

        if (typeof kPub !== 'string' || typeof kPriv !== 'string') return undefined

        const keyPair = {
            pubKey: stringToArrayBuffer(kPub),
            privKey: stringToArrayBuffer(kPriv),
        }

        if (isKeyPairType(keyPair) || typeof keyPair === 'undefined') {
            return keyPair
        }
        throw new Error('Item stored as identity key of unknown type.')
    }

    async getLocalRegistrationId(): Promise<number | undefined> {
        const rid = this.get2('registrationId', '')
        if (typeof rid === 'number' || typeof rid === 'undefined') {
            return rid
        }
        throw new Error('Stored Registration ID is not a number')
    }

    async isTrustedIdentity(
        identifier: string,
        identityKey: ArrayBuffer,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _direction: Direction
    ): Promise<boolean> {
        if (identifier === null || identifier === undefined) {
            throw new Error('tried to check identity key for undefined/null key')
        }
        const trusted = await this.get2('identityKey' + identifier, '')

        // TODO: Is this right? If the ID is NOT in our store we trust it?
        if (trusted === undefined) {
            return Promise.resolve(true)
        }
        return Promise.resolve(arrayBufferToString(identityKey) === trusted)
    }
    
    async loadSession(identifier: string): Promise<SessionRecordType | undefined> {
        const rec = this.get2('session' + identifier, '')
        if (typeof rec === 'string') {
            return rec as string
        } else if (typeof rec === 'undefined') {
            return rec
        }
        throw new Error(`session record is not an ArrayBuffer`)
    }

    async loadSignedPreKey(keyId: number | string): Promise<KeyPairType | undefined> {
        let pub = await this.get2('25519KeysignedPub' + keyId, '')
        let priv = await this.get2(`25519KeysignedPriv` + keyId, '')
        
        if(typeof pub !== 'string' || typeof priv !== 'string') return undefined

        const preKey: KeyPairType = {
            pubKey: stringToArrayBuffer(pub),
            privKey: stringToArrayBuffer(priv)
        }
        
        if (isKeyPairType(preKey)) {
            return preKey
        } else if (typeof pub === 'undefined') {
            return undefined
        }
        throw new Error(`stored key has wrong type`)
    }
    
    async removePreKey(keyId: number | string): Promise<void> {
        this.remove2('25519KeypreKey' + keyId)
    }
    async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
        if (identifier === null || identifier === undefined)
            throw new Error('Tried to put identity key for undefined/null key')

        const address = SignalProtocolAddress.fromString(identifier)

        const existing = await this.get2('identityKey' + address.getName(), '')
        this.put2('identityKey' + address.getName(), '')
        if (existing && !isArrayBuffer(existing)) {
            throw new Error('Identity Key is incorrect type')
        }

        if (existing && arrayBufferToString(identityKey) !== existing) {
            return true
        } else {
            return false
        }
    }

    async storeSession(identifier: string, record: SessionRecordType): Promise<void> {
        return this.put2('session' + identifier, record)
    }

    async loadIdentityKey(identifier: string): Promise<ArrayBuffer | undefined> {
        if (identifier === null || identifier === undefined) {
            throw new Error('Tried to get identity key for undefined/null key')
        }

        const key = await this.get2('identityKey' + identifier, '')

        if (typeof key ==='string') {
            const buffer = stringToArrayBuffer(key)
            if (isArrayBuffer(key)) {
                return buffer
            } else if (typeof key === 'undefined') {
                return key
            }
        }
        throw new Error(`Identity key has wrong type`)
    }

    async storePreKey(keyId: number | string, keyPair: KeyPairType): Promise<void> {
        await this.put2('25519KeypreKeyPub' + keyId, arrayBufferToString(keyPair.pubKey))
        await this.put2(`25519KeypreKeyPriv` + keyId, arrayBufferToString(keyPair.privKey))

        console.log('==> PreKey Keypair pubKey:', arrayBufferToString(keyPair.pubKey))
        console.log('==> PreKey KeyPair privKey:', arrayBufferToString(keyPair.privKey))
    }

    async loadPreKey(keyId: string | number): Promise<KeyPairType | undefined> {
        let pub = await this.get2('25519KeypreKeyPub' + keyId, '')
        let priv = await this.get2(`25519KeypreKeyPriv` + keyId, '')

        if(typeof pub !== 'string' || typeof priv !== 'string') return undefined

        const preKey: KeyPairType = {
            pubKey: stringToArrayBuffer(pub),
            privKey: stringToArrayBuffer(priv)
        }
        
        if (isKeyPairType(preKey)) {
            return preKey
        } else if (typeof pub === 'undefined') {
            return undefined
        }
        throw new Error(`stored key has wrong type`)
    }

    async storeSignedPreKey(keyId: number | string, keyPair: KeyPairType): Promise<void> {
        const signedPub = arrayBufferToString(keyPair.pubKey)
        const signedPriv = arrayBufferToString(keyPair.privKey)

        console.log("---> SignedPub: " + signedPub)
        console.log("---> SignedPriv: " + signedPriv)

        await this.put2('25519KeysignedPub' + keyId, signedPub)
        await this.put2(`25519KeysignedPriv` + keyId, signedPriv)
    }

    async storeSignature(keyId: number | string, signature: ArrayBuffer) {
        const signedSignature = arrayBufferToString(signature)

        console.log("---> SignedSignature: " + signedSignature)

        await this.put2(`25519signedKeySignature` + keyId, signedSignature)
    }

    async loadSignedSignature(keyId: number | string): Promise<ArrayBuffer | undefined> {
        let signature = await this.get2('25519signedKeySignature' + keyId, '')
        console.log("--> Signature loaded: " + signature)
        if(typeof signature !== 'string') return undefined
        return stringToArrayBuffer(signature)
    }

    async removeSignedPreKey(keyId: number | string): Promise<void> {
        //remover ambas as chaves
        return this.remove2('25519KeysignedKey' + keyId)
    }
    async removeSession(identifier: string): Promise<void> {
        return this.remove2('session' + identifier)
    }
    async removeAllSessions(identifier: string): Promise<void> {
        for (const id in this._store2) {
            if (id.startsWith('session' + identifier)) {
                this.remove2(id)
                //delete this._store[id]
            }
        }
    }
}

export function arrayBufferToString(b: ArrayBuffer): string {
    return uint8ArrayToString(new Uint8Array(b))
}

export function uint8ArrayToString(arr: Uint8Array): string {
    const end = arr.length
    let begin = 0
    if (begin === end) return ''
    let chars: number[] = []
    const parts: string[] = []
    while (begin < end) {
        chars.push(arr[begin++])
        if (chars.length >= 1024) {
            parts.push(String.fromCharCode(...chars))
            chars = []
        }
    }
    return parts.join('') + String.fromCharCode(...chars)
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufferView = new Uint16Array(buffer);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer);
    return encode(uint8Array);
}

// Convert Base64 to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const uint8Array = decode(base64);
    return uint8Array.buffer;
}