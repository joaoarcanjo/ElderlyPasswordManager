import { MessageType, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"
import { currentSessionSubject, removeSession, sessionForRemoteUser, sessionListSubject } from "../session/state"
import { SendAcknowledgeMessage, SendWebSocketMessage } from "../network/types"
import { signalStore, usernameSubject } from "../identity/state"
import { stringToArrayBuffer } from "../signal/signal-store"
import { signalWebsocket } from "../network/webSockets"
import { ChatSession } from "../session/types"
import { ChatMessageType, CredentialBody, ElderlyDataBody, ProcessedChatMessage } from "./types"
import { randomUUID } from 'expo-crypto'
import { setElderlyListUpdated } from "../../screens/list_elderly/actions/state"
import { getKeychainValueFor, saveKeychainValue } from "../../keychain"
import { caregiverId, elderlySSSKey } from "../../keychain/constants"
import { FlashMessage, credentialCreatedByOtherFlash, credentialDeletedByOtherFlash, credentialUpdatedByOtherFlash, editCompletedFlash, elderlySentFirstKey, sessionAcceptedFlash, sessionEndedFlash, sessionPermissionsFlash, sessionRejectMaxReachedFlash, sessionRejectedFlash, sessionRejectedMaxReachedFlash, sessionRequestReceivedFlash } from "../../components/UserMessages"
import { ElderlyRequestStatus } from "../../database/types"
import { checkElderlyByEmail, checkElderlyByEmailWaitingForResponse, deleteElderly, isMaxElderlyReached, saveElderly, updateElderly } from "../../database/elderlyFunctions"
import { setCredentialsListUpdated } from "../../screens/elderly_credentials/actions/state"

/**
 * Função para processar uma mensagem recebida de tipo 3
 * @param address Representa o identificador de quem enviou a mensagem.
 * @param message Conteúdo da mensagem enviada.
 */
export async function processPreKeyMessage(address: string, message: MessageType, type: number): Promise<void> {
    console.log('-> processPreKeyMessage')
    const cipher = new SessionCipher(signalStore, new SignalProtocolAddress(address, 1))
    const plaintextBytes = await cipher.decryptPreKeyWhisperMessage(message.body!, 'binary')
    let plaintext = String.fromCharCode(...new Uint8Array(plaintextBytes))

    const session : ChatSession= sessionForRemoteUser(address) || {
        remoteUsername: address,
        messages: [],
    }

    const sessionList = [...sessionListSubject.value]
    sessionList.unshift(session)
    sessionListSubject.next(sessionList)
    
    let cm: ProcessedChatMessage | null = null
    try{
        plaintext = plaintext.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, '')
        cm = JSON.parse(plaintext) as ProcessedChatMessage
        addMessageToSession(address, cm, type)
        //encryptAndSendMessage(address, 'firstMessage', true, ChatMessageType.START_SESSION)
    } catch (e) {
       // console.log(e)
    }
}

/**
 * Função para informar o remetente que a regularMessage foi recebida com sucesso.
 * @param address 
 * @param messageId Representa o id da mensagem que queremos informar ao remetente que foi recebida com sucesso. 
 * O remetente a receber um acknowledge de uma mensagem, não precisa da retransmitir.  
 */
function sendAcknowledgement(address: string, id: string) {
    const wsm: SendAcknowledgeMessage = {
        action: 'acknowledge',
        address: address,
        from: usernameSubject.value,
        messageId: id
    }
    signalWebsocket.next(wsm)
}

/**
 * Função para processar uma mensagem recebida de tipo 1
 * @param address Representa o identificador de quem enviou a mensagem.
 * @param message Conteúdo da mensagem enviada.
 */
export async function processRegularMessage(address: string, message: string, type: number): Promise<void> {
    console.log('-> processRegularMessage')
    
    const protocolAddress = new SignalProtocolAddress(address, 1)
    const cipher = new SessionCipher(signalStore, protocolAddress)
    
    const plaintextBytes = await cipher.decryptWhisperMessage(message, 'binary')
    
    let plaintext = String.fromCharCode(...new Uint8Array(plaintextBytes))
    plaintext = plaintext.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, '')
    const cm: ProcessedChatMessage = JSON.parse(plaintext)

    addMessageToSession(address, cm, type)
    sendAcknowledgement(address, cm.id)
}

/**
 * Para encriptar e enviar uma mensagem para determinado destinatário.
 * @param to 
 * @param message 
 */
export async function encryptAndSendMessage(to: string, message: string, firstMessage: boolean, type: ChatMessageType): Promise<void> {
    const address = new SignalProtocolAddress(to, 1)
    const cipher = new SessionCipher(signalStore, address)

    const cm: ProcessedChatMessage = {
        id: randomUUID(),
        address: to,
        from: usernameSubject.value,
        timestamp: Date.now(),
        firstMessage: firstMessage,
        body: message,
        type: type,
    }

    addMessageToSession(to, cm, 1, true)  
    const signalMessage = await cipher.encrypt(stringToArrayBuffer(JSON.stringify(cm)))
    sendSignalProtocolMessage(to, usernameSubject.value, signalMessage)
}

/**
 * @param to Username do destinatário
 * @param from Username de quem está a enviar
 * @param message Este campo é um objeto retornado pelo método "sessionCipher.encrypt"
 */
export function sendSignalProtocolMessage(to: string, from: string, message: MessageType): void {
    const wsm: SendWebSocketMessage = {
        action: 'sendMessage',
        address: to,
        from,
        message: JSON.stringify(message),
    }
    signalWebsocket.next(wsm)
}

export async function addMessageToSession(address: string, cm: ProcessedChatMessage, type: number, itsMine?: boolean): Promise<void> {
    console.log('===> addMessageToSessionCalled')
    const userSession = { ...sessionForRemoteUser(address)! }
    const currentUserId = await getKeychainValueFor(caregiverId)

    //Se for uma mensagem de dados do idoso e não for uma mensagem nossa (tipo 0)
    if(cm.type === ChatMessageType.PERSONAL_DATA && !itsMine) {
        await processPersonalData(currentUserId, cm)
        //userSession.messages.push(cm)  
    } else if(cm.type === ChatMessageType.KEY_UPDATE && !itsMine) {
        updateKeyMessage(cm)
        //userSession.messages.push(cm)  
    } else if (cm.type === ChatMessageType.REJECT_SESSION && !itsMine) {
        //vai apagar a sessão que foi criada com o possível cuidador
        await processRejectMessage(currentUserId, cm)
    } else if (cm.type === ChatMessageType.MAX_REACHED_SESSION && !itsMine) {
        //vai apagar a sessão que foi criada com o possível cuidador
        await processMaxReachedMessage(currentUserId, cm)
    } else if (cm.type === ChatMessageType.CREDENTIALS_UPDATED && !itsMine) {
        const data = JSON.parse(cm.body) as CredentialBody
        credentialUpdatedByOtherFlash(cm.from, data)
        setCredentialsListUpdated()
    } else if (cm.type === ChatMessageType.CREDENTIALS_CREATED && !itsMine) {
        const data = JSON.parse(cm.body) as CredentialBody
        credentialCreatedByOtherFlash(cm.from, data)
        setCredentialsListUpdated()
    } else if (cm.type === ChatMessageType.CREDENTIALS_DELETED && !itsMine) {
        const data = JSON.parse(cm.body) as CredentialBody
        credentialDeletedByOtherFlash(cm.from, data)
        setCredentialsListUpdated()
    } else if (cm.type === ChatMessageType.PERMISSION_DATA && !itsMine) {
        //Quando o idoso atualiza as permissoes. 
        setElderlyListUpdated()
        sessionPermissionsFlash(cm.from)
    } else if (cm.type === ChatMessageType.DECOUPLING_SESSION && !itsMine) {
        processDecouplingMessage(currentUserId, cm)
    } else if (type !== 3 && !cm.firstMessage) {
        userSession.messages.push(cm)
    }
    
    const sessionList = sessionListSubject.value.filter((session) => session.remoteUsername !== address)
    //console.log('Filtered session list', { sessionList })
    sessionList.unshift(userSession)
    sessionListSubject.next(sessionList)
    if (currentSessionSubject.value?.remoteUsername === address) {
        currentSessionSubject.next(userSession)
    }
}

async function processPersonalData(currentUserId: string, cm: ProcessedChatMessage) {
    const data = JSON.parse(cm.body) as ElderlyDataBody

    if (await checkElderlyByEmail(currentUserId, cm.from)) {
        await updateElderly(currentUserId, data.userId, data.email, data.name, data.phone)
        setElderlyListUpdated()
        editCompletedFlash(FlashMessage.elderlyPersonalInfoUpdated)   
    }  else if(await checkElderlyByEmailWaitingForResponse(currentUserId, cm.from)) {
        await updateElderly(currentUserId, data.userId, data.email, data.name, data.phone)
        .then(() => saveKeychainValue(elderlySSSKey(data.userId), data.key))
        .then(() => sessionAcceptedFlash(cm.from))
        .then(() => setElderlyListUpdated())
    } else {
        const isMaxReached = await isMaxElderlyReached(currentUserId)
        if(isMaxReached) {
            await refuseCaregiverMaxReached(cm)
        } else {
            await saveKeychainValue(elderlySSSKey(data.userId), data.key)
            .then(() => saveElderly(currentUserId, data.userId, data.name, data.email, data.phone, ElderlyRequestStatus.RECEIVED.valueOf()))
            .then(() => sessionRequestReceivedFlash(cm.from))
            .then(() => setElderlyListUpdated())
        }
    }
}

async function updateKeyMessage(cm: ProcessedChatMessage) {
    const data = JSON.parse(cm.body) as ElderlyDataBody
    const currentKey = await getKeychainValueFor(elderlySSSKey(data.userId))
    if (currentKey == '') {
        elderlySentFirstKey(cm.from)
    }
    saveKeychainValue(elderlySSSKey(data.userId), data.key)
}

export async function refuseCaregiverMaxReached(cm: ProcessedChatMessage) {
    await encryptAndSendMessage(cm.from, 'rejectSession', true, ChatMessageType.MAX_REACHED_SESSION)
    .then(() => removeSession(cm.from))
    .then(() => sessionRejectMaxReachedFlash(cm.from))    
}

async function processRejectMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processRejectMessageCalled")
    await deleteElderly(currentUserId, cm.from)
    sessionRejectedFlash(cm.from, false)
}

async function processMaxReachedMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processMaxReachedMessageCalled")
    await deleteElderly(currentUserId, cm.from)
    sessionRejectedMaxReachedFlash(cm.from)
}

async function processDecouplingMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processDecouplingMessageCalled")
    await deleteElderly(currentUserId, cm.from)
    sessionEndedFlash(cm.from)
    setElderlyListUpdated()
}