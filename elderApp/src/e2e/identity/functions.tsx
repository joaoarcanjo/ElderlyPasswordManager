import { KeyHelper, SignedPublicPreKeyType, PreKeyType, SignedPreKeyPairType, PreKeyPairType } from "@privacyresearch/libsignal-protocol-typescript";
import { initializeSignalWebsocket } from "../network/functions";
import { subscribeWebsocket } from "../network/webSockets";
import { SignalDirectory } from "../signal/signal-directory";
import { directorySubject, usernameSubject, signalStore } from "./state";
import { networkInfoSubject } from "../network/state";
import { port } from "../../assets/constants/constants";
import { getServerIP } from "../../firebase/firestore/functionalities";

/**
 * Vai criar a identidade no servidor
 * @param username 
 */
export async function createIdentity(userId: string, username: string): Promise<void> {


    if (usernameSubject.value === username) return
    console.log("Username: ", username)
    console.log("userId: ", userId)

    const ipAddress = await getServerIP()
    const url = `ws://${ipAddress}:${port}`
    
    //Inicia a ligação ao servidor 
    initializeSignalWebsocket(url)
    //Subscreve o servidor 
    subscribeWebsocket(username)

    const directory = new SignalDirectory(url)
    directorySubject.next(directory)
    usernameSubject.next(username)
    networkInfoSubject.next({ wssURI: url })

    if(await signalStore.getUserId() !== userId) {
        await signalStore.setUserId(userId)
    }

    let registrationId = await signalStore.getLocalRegistrationId()
    if(registrationId === -1) {
        registrationId = KeyHelper.generateRegistrationId()
        await signalStore.storeLocalRegistrationId(registrationId)
        registrationId = await signalStore.getLocalRegistrationId()
    }

    if(registrationId === undefined) {
        throw new Error("Error generating registrationId")
    }


    //const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
    let identityKeyPair = await signalStore.getIdentityKeyPair()
    if(identityKeyPair === undefined) {
        const identityKeyPairAux = await KeyHelper.generateIdentityKeyPair()
        await signalStore.storeIdentityKeyPair(identityKeyPairAux)
        identityKeyPair = identityKeyPairAux //await signalStore.getIdentityKeyPair()
    }

    if(identityKeyPair === undefined) {
        throw new Error("Error generating identityKeyPair")
    }

    let baseKeyId = await signalStore.getBaseKeyId()
    if(baseKeyId === -1) {
        const baseKeyIdAux = Math.floor(10000 * Math.random())
        await signalStore.storeBaseKeyId(baseKeyIdAux)
        baseKeyId = await signalStore.getBaseKeyId()
    }

    let preKeyPair = await signalStore.loadPreKey(baseKeyId)
    if(preKeyPair === undefined) {
        const preKeyPairAux = await KeyHelper.generatePreKey(baseKeyId)
        await signalStore.storePreKey(`${baseKeyId}`, preKeyPairAux.keyPair)
        preKeyPair = preKeyPairAux.keyPair//await signalStore.loadPreKey(baseKeyId)
    }
    if(preKeyPair === undefined) {
        throw new Error("Error generating preKeyPair")
    }

    const preKey: PreKeyPairType = {
        keyId: baseKeyId,
        keyPair: preKeyPair
    }
    signalStore.storePreKey(`${baseKeyId}`, preKey.keyPair)
    let signedPreKeyId = await signalStore.getSignedPreKeyId()
    if(signedPreKeyId === -1) {
        const baseKeyIdAux = Math.floor(10000 * Math.random())
        await signalStore.storeSignedPreKeyId(baseKeyIdAux)
        signedPreKeyId = await signalStore.getSignedPreKeyId()
    }

    if(signedPreKeyId === -1 || typeof signedPreKeyId !== 'number') {
        throw new Error("Error generating signedPreKeyId")
    }
    
    //console.log("signedPreKeyId: ", signedPreKeyId)
    let signedPreKeyPair = await signalStore.loadSignedPreKey(signedPreKeyId)
    let signature = await signalStore.loadSignedSignature(signedPreKeyId)
    if(signedPreKeyPair === undefined || signature === undefined) {
        const preKeyPairAux = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
        await signalStore.storeSignedPreKey(`${signedPreKeyId}`, preKeyPairAux.keyPair)
        await signalStore.storeSignature(`${signedPreKeyId}`, preKeyPairAux.signature)
        signedPreKeyPair = await signalStore.loadSignedPreKey(signedPreKeyId)
        signature = await signalStore.loadSignedSignature(signedPreKeyId)

    }

    if(signedPreKeyPair === undefined || signature === undefined) {
        throw new Error("Error generating signedPreKeyPair")
    }    

    const signedPreKey: SignedPreKeyPairType<ArrayBuffer> = {
        keyId: signedPreKeyId,
        keyPair: signedPreKeyPair,
        signature: signature,
    }

    signalStore.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)

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
    directory.storeKeyBundle(username, userId, {
        registrationId,
        identityKey: identityKeyPair.pubKey,
        signedPreKey: publicSignedPreKey,
        oneTimePreKeys: [publicPreKey],
    }) 
}