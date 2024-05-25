import { SignedPublicPreKeyType, DeviceType, PreKeyType } from '@privacyresearch/libsignal-protocol-typescript'
import { encode as encodeBase64} from '@stablelib/base64';
import { sign } from 'tweetnacl'
import { decodeBase64 } from 'tweetnacl-util'
import * as base64 from 'base64-js'
import { apiPort, emptyValue } from '../../assets/constants/constants'
import { Errors } from '../../exceptions/types'
import { stringToArrayBuffer } from './signal-store';
import { getKeychainValueFor, saveKeychainValue } from '../../keychain';
import { signalPrivateKey, signalPublicKey } from '../../keychain/constants';
import { getServerIP } from '../../firebase/firestore/functionalities';

export interface PublicDirectoryEntry {
    identityKey: ArrayBuffer
    signedPreKey: SignedPublicPreKeyType
    oneTimePreKey?: ArrayBuffer
}

interface FullDirectoryEntry {
    registrationId: number
    identityKey: ArrayBuffer
    signedPreKey: SignedPublicPreKeyType
    oneTimePreKeys: PreKeyType[]
}

export interface PublicPreKey {
    keyId: number
    publicKey: string
}

export interface SignedPublicKey {
    keyId: number
    publicKey: string
    signature: string
}

export interface PublicPreKeyBundle {
    identityKey: string
    registrationId: number
    signedPreKey: SignedPublicKey
    preKey?: PublicPreKey
}

interface SerializedFullDirectoryEntry {
    username: string,
    bundle: {
        identityKey: string
        registrationId: number
        signedPreKey: SignedPublicKey
        oneTimePreKeys: PublicPreKey[]
    }
}

export class SignalDirectory {
    constructor(private _url: string) {}

    async storeKeyBundle(username: string, userId: string, bundle: FullDirectoryEntry): Promise<void> {

        const serializedBundle = serializeKeyRegistrationBundle(username, bundle)
        const bundleString = JSON.stringify({
            "bundle": serializedBundle,
            "username": username,
            "userType": "caregiver",
            "timestamp": Date.now()
        })

        let privKey = decodeBase64(await getKeychainValueFor(signalPrivateKey(userId)))
        let pubKey = decodeBase64(await getKeychainValueFor(signalPublicKey(userId)))

        if(privKey.byteLength === 0 || pubKey.byteLength === 0) {
            const boxKeyPair = sign.keyPair()
            privKey = boxKeyPair.secretKey
            pubKey = boxKeyPair.publicKey
            await saveKeychainValue(signalPrivateKey(userId), encodeBase64(new Uint8Array(privKey)))
            await saveKeychainValue(signalPublicKey(userId), encodeBase64(new Uint8Array(pubKey)))
        }

        const signed = sign(
            new Uint8Array(stringToArrayBuffer(bundleString)),
            new Uint8Array(privKey)
        )
        
        const body = {
            "publicKey": encodeBase64(new Uint8Array(pubKey)),
            "bundleSigned": encodeBase64(signed),
            "username": username,

        }

        const ipAddress = await getServerIP()
        return await fetch(`${ipAddress}:${apiPort}/addBundle`, {
            method: 'PUT',
            //headers: { 'x-api-key': this._apiKey },
            headers: {
                'Content-Type': 'application/json',
                // Optionally include any other headers if needed
                //'x-api-key': this._apiKey
            },
            body: JSON.stringify(body),
        })
        .then((res) => {
            return res.json()
        })
        .catch((_error) => {
            alert(Errors.ERROR_SERVER_INTERNAL_ERROR)
        })
    }

    async getPreKeyBundle(address: string): Promise<DeviceType | undefined> {
        const ipAddress = await getServerIP()
        const res = await fetch(`${ipAddress}:${apiPort}/getElderlyBundle/${address}`)
        
        const bundle = await res.json() 
        if (bundle === null || !bundle) {
            return undefined
        } else {
            try {
                const bundleString = JSON.stringify(bundle)
                const bundleParsed = JSON.parse(bundleString.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, emptyValue))
                const { identityKey, signedPreKey, registrationId, preKey } = bundleParsed.bundle || {};
                return deserializeKeyBundle({ identityKey, signedPreKey, preKey, registrationId })
            }catch(e) { 
                console.log("Erro: "+e)
            }
        }
        const { identityKey, signedPreKey, registrationId, preKey } = bundle || {};
        return deserializeKeyBundle({ identityKey, signedPreKey, preKey, registrationId })
    }

    get url(): string {
        return this._url
    }
    /*
    get apiKey(): string {
        return this._apiKey
    }*/
}

export function serializeKeyRegistrationBundle(username: string, dv: FullDirectoryEntry): SerializedFullDirectoryEntry {
    const identityKey = base64.fromByteArray(new Uint8Array(dv.identityKey))
    const signedPreKey: SignedPublicKey = {
        keyId: dv.signedPreKey.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.signedPreKey.publicKey)),
        signature: base64.fromByteArray(new Uint8Array(dv.signedPreKey.signature)),
    }

    const oneTimePreKeys: PublicPreKey[] = dv.oneTimePreKeys.map((pk) => ({
        keyId: pk.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(pk.publicKey)),
    }))

    return {
        username: username,
        bundle: {
            identityKey,
            signedPreKey,
            oneTimePreKeys,
            registrationId: dv.registrationId,
        }
    }
}

export function serializeKeyBundle(dv: DeviceType): PublicPreKeyBundle {
    const identityKey = base64.fromByteArray(new Uint8Array(dv.identityKey))
    const signedPreKey: SignedPublicKey = {
        keyId: dv.signedPreKey.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.signedPreKey.publicKey)),
        signature: base64.fromByteArray(new Uint8Array(dv.signedPreKey.signature)),
    }

    const preKey: PublicPreKey = {
        keyId: dv.preKey!.keyId,
        publicKey: base64.fromByteArray(new Uint8Array(dv.preKey!.publicKey)),
    }

    return {
        identityKey,
        signedPreKey,
        preKey,
        registrationId: dv.registrationId!,
    }
}

export function deserializeKeyBundle(kb: PublicPreKeyBundle): DeviceType {
    const identityKey = base64.toByteArray(kb.identityKey).buffer
    const signedPreKey: SignedPublicPreKeyType = {
        keyId: kb.signedPreKey.keyId,
        publicKey: base64.toByteArray(kb.signedPreKey.publicKey),
        signature: base64.toByteArray(kb.signedPreKey.signature),
    }
    const preKey: PreKeyType | undefined = kb.preKey && {
        keyId: kb.preKey.keyId,
        publicKey: base64.toByteArray(kb.preKey.publicKey),
    }

    return {
        identityKey,
        signedPreKey,
        preKey,
        registrationId: kb.registrationId,
    }
}