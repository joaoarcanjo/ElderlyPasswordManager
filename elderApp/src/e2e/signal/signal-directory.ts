import { SignedPublicPreKeyType, DeviceType, PreKeyType } from '@privacyresearch/libsignal-protocol-typescript'

import * as base64 from 'base64-js'
import { ipAddress } from '../../assets/constants'

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

//TODO: Adicionar a X-API-KEY no header, é importante!!
//TODO: De momento as One-time prekeys não estão a ser atualizadas!! Quando a pre-key é utilizada numa sessão, tem que ser descartada.
export class SignalDirectory {
    constructor(private _url: string/*, private _apiKey: string*/) {}

    async storeKeyBundle(username: string, bundle: FullDirectoryEntry): Promise<void> {
        const res = await fetch(`http://${ipAddress}:443/addBundle`, {
            method: 'PUT',
            //headers: { 'x-api-key': this._apiKey },
            headers: {
                'Content-Type': 'application/json',
                // Optionally include any other headers if needed
                //'x-api-key': this._apiKey
            },
            body: JSON.stringify(serializeKeyRegistrationBundle(username, bundle)),
        })
        await res.json()
    }

    async getPreKeyBundle(address: string): Promise<DeviceType | undefined> {
        //console.log("-> getPreKeyBundle: "+address)
        const res = await fetch(`http://${ipAddress}:443/getBundle/${address}`/*, { headers: { 'x-api-key': this._apiKey } }*/)
        
        const bundle = await res.json()
        if (!bundle) {
            return undefined
        }
        const { identityKey, signedPreKey, registrationId, preKey } = bundle
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
