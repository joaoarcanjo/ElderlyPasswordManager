import { SessionBuilder, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"
import { directorySubject, signalStore, usernameSubject } from "../identity/state"
import { ChatSession } from "./types"
import { sessionListSubject } from "./state"
import { stringToArrayBuffer } from "../signal/signal-store"
import { ChatMessageType, ProcessedChatMessage } from "../messages/types"
import { randomUUID } from 'expo-crypto'
import { sendSignalProtocolMessage } from "../messages/sendMessage"

/**
 * Para começar uma conversa com um destinatário.
 * Começa por obter o bundle que se encontra no da diretoria, no nosso caso, o servidor.
 * @param recipient 
 */
export async function startSession(recipient: string): Promise<void> {
    console.log("--> Start session!")
    let directory = directorySubject.value!
    console.log("- Directory: ", directory)
    const keyBundle = await directory.getPreKeyBundle(recipient)
    const recipientAddress = new SignalProtocolAddress(recipient, 1)
    // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
    const sessionBuilder = new SessionBuilder(signalStore, recipientAddress)

    try {
        console.log("- KeyBundle: ", keyBundle)
        const session = await sessionBuilder.processPreKey(keyBundle!)
    } catch (e) {
        console.log("Error: ", e)
    }

    const cm: ProcessedChatMessage = {
        id: randomUUID(),
        address: recipient,
        from: usernameSubject.value,
        timestamp: Date.now(),
        firstMessage: true,
        body: 'firstMessage',
        type: ChatMessageType.START_SESSION,
    }

    // Now we can send an encrypted message
    const sessionCipher = new SessionCipher(signalStore, recipientAddress)
    const ciphertext = await sessionCipher.encrypt(stringToArrayBuffer(JSON.stringify(cm)))

    console.log("- RemoteRecipient: ", recipient)
    sendSignalProtocolMessage(recipient, usernameSubject.value, ciphertext)

    const newSession: ChatSession = {
        remoteUsername: recipient,
        messages: [],
    }
    const sessionList = [...sessionListSubject.value]
    sessionList.unshift(newSession)
    sessionListSubject.next(sessionList)
}