import { KeyHelper, SignedPublicPreKeyType, PreKeyType } from "@privacyresearch/libsignal-protocol-typescript";
import { initializeSignalWebsocket } from "../network/functions";
import { subscribeWebsocket } from "../network/webSockets";
import { SignalDirectory } from "../signal/signal-directory";
import { directorySubject, usernameSubject, signalStore } from "./state";
import { networkInfoSubject } from "../network/state";
/**
 * Vai criar a identidade no servidor
 * @param username 
 */
export async function createIdentity(username: string): Promise<void> {

    if (usernameSubject.value === username) return

    //TODO: este url tem que ser obtido da firebase, porque o url do server pode alterar.
    const url = 'http://192.168.1.84:442'
    
    //Inicia a ligação ao servidor 
    initializeSignalWebsocket(url)
    //Subscreve o servidor
    subscribeWebsocket(username)

    const directory = new SignalDirectory(url)
    directorySubject.next(directory)
    usernameSubject.next(username)
    networkInfoSubject.next({ wssURI: url })

    const registrationId = KeyHelper.generateRegistrationId()
    signalStore.put(`registrationID`, registrationId)

    const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
    signalStore.put('identityKey', identityKeyPair)
    //console.log('Generated identity key', { identityKeyPair })

    const baseKeyId = Math.floor(10000 * Math.random())
    console.log("baseKeyId: ", baseKeyId)
    const preKey = await KeyHelper.generatePreKey(baseKeyId)
    signalStore.storePreKey(`${baseKeyId}`, preKey.keyPair)
    console.log("baseKeyId 2: ", preKey.keyId)
    //console.log('Generated pre key', { preKey })

    const signedPreKeyId = Math.floor(10000 * Math.random())
    console.log("signedPreKeyId: ", signedPreKeyId)
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
    signalStore.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)
    console.log("signedPreKeyId 2: ", signedPreKey.keyId)

    const publicSignedPreKey: SignedPublicPreKeyType = {
        keyId: signedPreKeyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature,
    }

    const publicPreKey: PreKeyType = {
        keyId: preKey.keyId,
        publicKey: preKey.keyPair.pubKey,
    }

    //TODO: Enviar o bundle para o servidor, mas com mais que uma oneTimePreKeys.
    directory.storeKeyBundle(username, {
        registrationId,
        identityKey: identityKeyPair.pubKey,
        signedPreKey: publicSignedPreKey,
        oneTimePreKeys: [publicPreKey],
    }) 
}