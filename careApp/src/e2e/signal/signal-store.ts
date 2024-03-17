/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    StorageType,
    Direction,
    SessionRecordType,
    SignalProtocolAddress,
    PreKeyPairType,
    SignedPreKeyPairType,
} from '@privacyresearch/libsignal-protocol-typescript'

import { deleteAllSessions, deleteSessionById, getSessionById, saveSignalSessions } from "../../database/signalSessions"
import { deleteKeychainValueFor, getKeychainValueFor, saveKeychainValue } from "../../keychain"
import { keySignedPub25519, keySignedPriv25519, signedKeySignature25519, signedPreKeyId, identityIdPubKey, identityIdPrivKey, identityKeyK, keypreKeyPub25519, keypreKeyPriv25519, baseKeyIdK, caregiverId, localDBKey } from '../../keychain/constants'

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

function isArrayBuffer(thing: StoreValue): boolean {
    const t = typeof thing
    return !!thing && t !== 'string' && t !== 'number' && 'byteLength' in (thing as any)
}

type StoreValue =  string | number | ArrayBuffer

export class SignalProtocolStore implements StorageType {
    private _store: Record<string, StoreValue>
    private _userId: string
    private _dbKey: string

    constructor() {
        this._store = {}
        this._userId = ''
        this._dbKey = ''
    }

    //===============
    //==== Operations
    async get(key: string, defaultValue: StoreValue): Promise<StoreValue> {
        if (key === null || key === undefined) throw new Error('Tried to get value for undefined/null key')
        if (key in this._store) {
            return this._store[key]
        } else {
            const value = await getKeychainValueFor(key)
            if(value) {
                this._store[key] = value
                return value
            }
            return defaultValue
        }
    }
    async remove(key: string): Promise<void> {
        if (key === null || key === undefined) throw new Error('Tried to remove value for undefined/null key')
        delete this._store[key]
        await deleteKeychainValueFor(key)
    }

    async put(key: string, value: StoreValue): Promise<void> {
        if (key === undefined || value === undefined || key === null || value === null)
            throw new Error('Tried to store undefined/null')

        let valueToSave = undefined
        if(isArrayBuffer(value)) {
            valueToSave = ArrayBufferToHex(value as ArrayBuffer)
        } else if(typeof value === 'number') {
            valueToSave = value.toString()
        } else {
            valueToSave = value as string
        }
        await saveKeychainValue(key, valueToSave)
        this._store[key] = valueToSave
    }
    
    async getUserId(): Promise<string> {
        if (this._userId === '') {
            await this.setUserId(await getKeychainValueFor(caregiverId)) 
        }
        return this._userId
    }

    async setUserId(userId: string): Promise<void> {
        this._userId = userId
    }

    async getDBKey(): Promise<string> {
        if (this._dbKey === '') {
            await this.setDBKey(await getKeychainValueFor(localDBKey(await this.getUserId()))) 
        }
        return this._dbKey
    }

    async setDBKey(dbKey: string): Promise<void> {
        this._dbKey = dbKey
    }

    //================================
    //==== Registration Ids operations
    async getLocalRegistrationId(): Promise<number | undefined> {
        console.log('===> getLocalRegistrationIdCalled')
        return Number(await this.get('registrationId', -1))
    }
    async storeLocalRegistrationId(registrationId: number): Promise<void> {
        console.log('===> storeLocalRegistrationIdCalled')
        return this.put('registrationId', registrationId)
    }
    
    //============================
    //==== SignedPreKey operations 
    async loadSignedPreKey(keyId: number | string): Promise<KeyPairType | undefined> {
        console.log("===> loadSignedPreKeyCalled")
        let kPub = await this.get(keySignedPub25519(await this.getUserId(), keyId), '')
        let kPriv = await this.get(keySignedPriv25519(await this.getUserId(), keyId), '')
        
        if(typeof kPub !== 'string' || typeof kPriv !== 'string' || kPub === '' || kPriv === '') return undefined

        const preKey: KeyPairType = {
            pubKey: hexToArrayBuffer(kPub),
            privKey: hexToArrayBuffer(kPriv)
        }
        
        if (isKeyPairType(preKey)) {
            return preKey
        } else if (typeof kPub === 'undefined') {
            return undefined
        }
        throw new Error(`stored key has wrong type`)
    }
    async loadSignedSignature(keyId: number | string): Promise<ArrayBuffer | undefined> {
        console.log("===> loadSignedSignatureCalled")
        let signature = await this.get(signedKeySignature25519(await this.getUserId(), keyId), '')
        if(typeof signature !== 'string' || signature === '') return undefined
        return hexToArrayBuffer(signature)
    }
    async storeSignedPreKey(keyId: number | string, keyPair: KeyPairType): Promise<void> {
        console.log('===> storeSignedPreKeyCalled')
        await this.put(keySignedPub25519(await this.getUserId(), keyId), ArrayBufferToHex(keyPair.pubKey))
        await this.put(keySignedPriv25519(await this.getUserId(), keyId), ArrayBufferToHex(keyPair.privKey))
    }
    async storeSignature(keyId: number | string, signature: ArrayBuffer) {
        console.log('===> storeSignatureCalled')
        await this.put(signedKeySignature25519(await this.getUserId(), keyId), ArrayBufferToHex(signature))
    }
    async getSignedPreKeyId(): Promise<number> {
        console.log('===> getSignedPreKeyIdCalled')
        return Number(await this.get(signedPreKeyId(await this.getUserId()), -1))
    }
    async storeSignedPreKeyId(registrationId: number): Promise<void> {
        console.log('===> storeLocalRegistrationIdCalled')
        await this.put(signedPreKeyId(await this.getUserId()), registrationId)
    }
    async removeSignedPreKey(keyId: number | string): Promise<void> {
        console.log('===> removeSignedPreKeyCalled')
        await this.remove(signedPreKeyId(await this.getUserId()))
        await this.remove(signedKeySignature25519(await this.getUserId(), keyId))
        await this.remove(keySignedPub25519(await this.getUserId(), keyId))
        await this.remove(keySignedPriv25519(await this.getUserId(), keyId))
    }

    //=================================
    //==== Identity Key pair operations
    async getIdentityKeyPair(): Promise<KeyPairType | undefined> {
        console.log("===> getIdentityKeyPairCalled")
        const kPub = await this.get(identityIdPubKey(await this.getUserId()), '')
        const kPriv = await this.get(identityIdPrivKey(await this.getUserId()), '')

        if (typeof kPub !== 'string' || typeof kPriv !== 'string' || kPub === '' || kPriv === '') return undefined

        const keyPair = {
            pubKey: hexToArrayBuffer(kPub),
            privKey: hexToArrayBuffer(kPriv),
        }

        if (isKeyPairType(keyPair)) {
            return keyPair
        }
        throw new Error('Item stored as identity key of unknown type.')
    }
    async storeIdentityKeyPair(keyPair: KeyPairType): Promise<void> {
        console.log("===> storeIdentityKeyPairCalled")
        await this.put(identityIdPubKey(await this.getUserId()), ArrayBufferToHex(keyPair.pubKey))
        await this.put(identityIdPrivKey(await this.getUserId()), ArrayBufferToHex(keyPair.privKey))
    }
    async loadIdentityKey(identifier: string): Promise<ArrayBuffer | undefined> {
        console.log("===> loadIdentityKeyCalled")
        if (identifier === null || identifier === undefined) {
            throw new Error('Tried to get identity key for undefined/null key')
        }

        const key = await this.get(identityKeyK(await this.getUserId(), identifier), '')

        if(typeof key ==='string') {
            return hexToArrayBuffer(key)
        } else if (typeof key === 'undefined') {
            return key
        }
        
        throw new Error(`Identity key has wrong type`)
    }
    async isTrustedIdentity(
        identifier: string,
        identityKey: ArrayBuffer,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _direction: Direction
    ): Promise<boolean> {
        console.log("===> isTrustedIdentityCalled")
        if (identifier === null || identifier === undefined) {
            throw new Error('tried to check identity key for undefined/null key')
        }
        const trusted = await this.get(identityKeyK(await this.getUserId(), identifier), '')
        if (trusted === undefined || trusted === '') {
            return Promise.resolve(true)
        }
        return Promise.resolve(ArrayBufferToHex(identityKey) === trusted)
    }
    async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
        console.log("===> SaveIdentityCalled")
        if (identifier === null || identifier === undefined)
            throw new Error('Tried to put identity key for undefined/null key')

        const address = SignalProtocolAddress.fromString(identifier)

        const existing = await this.get(identityKeyK(await this.getUserId(), address.getName()), '')
        const converted = hexToArrayBuffer(existing as string)
        await this.put(identityKeyK(await this.getUserId(), address.getName()), identityKey)

        if (converted && !isArrayBuffer(converted)) {
            throw new Error('Identity Key is incorrect type')
        }

        if (converted && identityKey !== existing) {
            return true
        } else {
            return false
        }
    }

    //======================
    //==== PreKey operations
    async loadPreKey(keyId: string | number): Promise<KeyPairType | undefined> {
        console.log("===> loadPreKeyCalled")
        let pub = await this.get(keypreKeyPub25519(await this.getUserId(), keyId), '')
        let priv = await this.get(keypreKeyPriv25519(await this.getUserId(), keyId), '')

        if (typeof pub !== 'string' || typeof priv !== 'string' || pub === '' || priv === '') return undefined

        const preKey: KeyPairType = {
            pubKey: hexToArrayBuffer(pub),
            privKey: hexToArrayBuffer(priv)
        }
        
        if (isKeyPairType(preKey)) {
            return preKey
        } else if (typeof pub === 'undefined') {
            return undefined
        }
        throw new Error(`stored key has wrong type`)
    }
    async storePreKey(keyId: number | string, keyPair: KeyPairType): Promise<void> {
        await this.put(keypreKeyPub25519(await this.getUserId(), keyId), ArrayBufferToHex(keyPair.pubKey))
        await this.put(keypreKeyPriv25519(await this.getUserId(), keyId), ArrayBufferToHex(keyPair.privKey))
    }
    async removePreKey(keyId: number | string): Promise<void> {
        await this.remove(keypreKeyPriv25519(await this.getUserId(), keyId))
        await this.remove(keypreKeyPub25519(await this.getUserId(), keyId))
        await this.remove(baseKeyIdK(await this.getUserId()))
    }
    async getBaseKeyId(): Promise<number> {
        console.log('===> getBaseKeyId')
        return Number(await this.get(baseKeyIdK(await this.getUserId()), -1))
    }
    async storeBaseKeyId(baseKeyId: number): Promise<void> {
        console.log('===> storeBaseKeyId')
        return this.put(baseKeyIdK(await this.getUserId()), baseKeyId)
    }

    //=======================
    //==== Session operations 
    //==-> obter do sql.
    async loadSession(identifier: string): Promise<SessionRecordType | undefined> {
        console.log("===> LoadSessionCalled")
        const rec = await getSessionById('session' + identifier, await this.getUserId(), await this.getDBKey())
        if (typeof rec === 'object') {
            return rec.record as string
        } else if (typeof rec === 'undefined') {
            return rec
        }
        throw new Error(`session record is not an ArrayBuffer`)
    }
    async storeSession(identifier: string, record: SessionRecordType): Promise<void> { 
        console.log("===> StoreSessionCalled")
        await saveSignalSessions(await this.getUserId(), 'session' + identifier, record, await this.getDBKey())
    }
    async removeSession(identifier: string): Promise<void> {
        console.log("===> RemoveSessionCalled")
        await deleteSessionById(await this.getUserId(),'session' + identifier)
    }
    async removeAllSessions(identifier: string): Promise<void> {
        console.log("===> RemoveAllSessionsCalled")
        await deleteAllSessions(await this.getUserId())
    }
}

//==========
//==== Utils
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

function ArrayBufferToHex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

export function hexToArrayBuffer(str: string): ArrayBuffer {
    const ret = new ArrayBuffer(str.length / 2)
    const array = new Uint8Array(ret)
    for (let i = 0; i < str.length / 2; i++) array[i] = parseInt(str.substr(i * 2, 2), 16)
    return ret
}