import { KeyHelper, SignedPublicPreKeyType, PreKeyType, KeyPairType, PreKeyPairType } from "@privacyresearch/libsignal-protocol-typescript";
import { initializeSignalWebsocket } from "../network/functions";
import { subscribeWebsocket } from "../network/webSockets";
import { SignalDirectory } from "../signal/signal-directory";
import { directorySubject, usernameSubject, signalStore } from "./state";
import { networkInfoSubject } from "../network/state";
import { arrayBufferToString, stringToArrayBuffer } from "../signal/signal-store";
/**
 * Vai criar a identidade no servidor
 * @param username 
 */
/*
export async function createIdentity(username: string): Promise<void> {

    if (usernameSubject.value === username) return

    //TODO: este url tem que ser obtido da firebase, porque o url do server pode alterar.
    const url = 'http://192.168.1.68:442'
    
    //Inicia a ligação ao servidor 
    initializeSignalWebsocket(url)
    //Subscreve o servidor
    subscribeWebsocket(username)

    const directory = new SignalDirectory(url)
    directorySubject.next(directory)
    usernameSubject.next(username)
    networkInfoSubject.next({ wssURI: url })

    //REGISTRATIONID
    console.log("--> REGISTRATIONID")
    let registrationId = await signalStore.get2('registrationID', '')
    if(registrationId === '') {
        registrationId = KeyHelper.generateRegistrationId()
        await signalStore.put2(`registrationID`, registrationId)
    } 
    console.log('Registration ID:', registrationId)

    //IDENTITYKEYPAIR
    console.log("--> IDENTITYKEYPAIR")
    let identityIdPubKey = await signalStore.get2('identityIdPubKey', '')
    let identityKeyPair = undefined
    if(typeof identityIdPubKey === 'string') {
        if(identityIdPubKey === '') {
            console.log('=> Identity Key does not exist')
            const auxIdentityKeyPair = await KeyHelper.generateIdentityKeyPair()

            await signalStore.put2(`identityIdPubKey`, arrayBufferToString(auxIdentityKeyPair.pubKey))
            await signalStore.put2(`identityIdPrivKey`, arrayBufferToString(auxIdentityKeyPair.privKey))

        }  else {
            console.log('=> Identity Key already exists')
        }

        identityKeyPair = {
            pubKey: stringToArrayBuffer(await signalStore.get2('identityIdPubKey','') as string),
            privKey: stringToArrayBuffer(await signalStore.get2('identityIdPrivKey','') as string)
        }

        console.log('==> Identity KeyPair pubKey:', arrayBufferToString(identityKeyPair.pubKey))
        console.log('==> Identity KeyPair privKey:', arrayBufferToString(identityKeyPair.privKey))

        //signalStore.remove2('identityIdPubKey')
    }
    
    //PREKEY
    console.log("--> PREKEY")
    let preKey = undefined

    let baseKeyID = await signalStore.get2('baseKeyId', '')
    if(baseKeyID === '') {
        console.log('=> Pre Key does not exists')
        baseKeyID = Math.floor(10000 * Math.random())
        await signalStore.put2(`baseKeyId`, baseKeyID)

        preKey = await KeyHelper.generatePreKey(baseKeyID)

        signalStore.storePreKey(`${baseKeyID}`, preKey.keyPair)
        
    } else {
        console.log('=> Pre key already exists')
        preKey = {
            keyId: baseKeyID,
            keyPair: await signalStore.loadPreKey(baseKeyID)
        }
    }
    console.log('=> Generated pre key', { preKey })

    //SIGNEDPREKEY
    console.log("--> SIGNEDPREKEY")
    let signedPreKey = undefined

    let signedPreKeyID: number = await signalStore.get2('signedPreKeyId', 0) as number

    console.log("---> signedPreKeyID: "+ signedPreKeyID)
    
    function isNonNegativeInteger(n: unknown): n is number {
        return typeof n === 'number' && n % 1 === 0 && n >= 0
    }

    if(signedPreKeyID === 0 && identityKeyPair) {
        console.log('=> Signed Pre Key does not exists')

        signedPreKeyID = Math.floor(10000 * Math.random())
        await signalStore.put2(`signedPreKeyId`, signedPreKeyID)

        console.log("TEST: " + identityKeyPair)
        console.log("TEST2: " + typeof signedPreKeyID === 'number')
        signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyID)
        await signalStore.storeSignedPreKey(signedPreKeyID, signedPreKey.keyPair)

    } else {
        console.log('=> Signed Pre key already exists') 

        const signedPreKeyAux = await signalStore.loadSignedPreKey(signedPreKeyID)
        const signatureAux = await signalStore.loadSignedSignature(signedPreKeyID)

        signedPreKey = {
            keyId: signedPreKeyID,
            keyPair: signedPreKeyAux,
            signature: signatureAux
        }
    }
    console.log('Generated signed pre key', { signedPreKey })

    signalStore.remove2('signedPreKeyId')
    signalStore.remove2('25519KeysignedPub' + signedPreKeyID)
    signalStore.remove2('25519KeysignedPriv' + signedPreKeyID)
/*
    signedPreKeyID = signedPreKeyID as number
    const publicSignedPreKey: SignedPublicPreKeyType = {
        keyId: signedPreKeyID,
        publicKey: signedPreKey.keyPair!.pubKey,
        signature: signedPreKey.signature!,
    }

    baseKeyID = baseKeyID as number
    const publicPreKey: PreKeyType = {
        keyId: baseKeyID,
        publicKey: preKey.keyPair!.pubKey,
    }

    //TODO: Enviar o bundle para o servidor, mas com mais que uma oneTimePreKeys.

    registrationId = registrationId as number
    directory.storeKeyBundle(username, {
        registrationId,
        identityKey: identityKeyPair!.pubKey,
        signedPreKey: publicSignedPreKey,
        oneTimePreKeys: [publicPreKey],
    })
}*/