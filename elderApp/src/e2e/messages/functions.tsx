import { MessageType, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"

import { currentSessionSubject, sessionForRemoteUser, sessionListSubject } from "../session/state"
import { SendAcknowledgeMessage, SendWebSocketMessage } from "../network/types"
import { signalStore, usernameSubject } from "../identity/state"
import { stringToArrayBuffer } from "../signal/signal-store"
import { signalWebsocket } from "../network/webSockets"
import { ChatSession } from "../session/types"
import { ChatMessageType, CaregiverDataBody, ProcessedChatMessage, CredentialBody } from "./types"
import { randomUUID } from 'expo-crypto'
import { setCaregiverListUpdated } from "../../screens/list_caregivers/actions/state"
import { FlashMessage, credentialCreatedByOtherFlash, credentialDeletedByOtherFlash, credentialUpdatedByOtherFlash, editCompletedFlash, sessionAcceptedFlash, sessionEndedFlash, sessionRejectedFlash, sessionRequestReceivedFlash } from "../../components/UserMessages"
import { getKeychainValueFor } from "../../keychain"
import { elderlyId } from "../../keychain/constants"
import { addCaregiverToArray, removeCaregiverFromArray } from "../../firebase/firestore/functionalities"
import { changeCaregiverStatusOnDatabase, checkCaregiverByEmail, checkCaregiverByEmailNotAccepted, deleteCaregiver, getCaregiverId, saveCaregiver, updateCaregiver } from "../../database/caregivers"
//import { MessageType, SessionCipher, SignalProtocolAddress } from "../../algorithms/signal"
import { CaregiverRequestStatus } from "../../database/types"
import { executeKeyExchange } from "../../algorithms/sss/sssOperations"
import { setCredentialsListUpdated } from "../../screens/list_credentials/actions/state"
//import { SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"

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
        //console.log(e)
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

    const userSession = { ...sessionForRemoteUser(address)! }
    if(!userSession.remoteUsername) {
        const session : ChatSession= sessionForRemoteUser(address) || {
            remoteUsername: address,
            messages: [],
        }
        const sessionList = [...sessionListSubject.value]
        sessionList.unshift(session)
        sessionListSubject.next(sessionList)
    }
    
    const protocolAddress = new SignalProtocolAddress(address, 1)
    const cipher = new SessionCipher(signalStore, protocolAddress)
    
    const plaintextBytes = await cipher.decryptWhisperMessage(message, 'binary')
    
    let plaintext = String.fromCharCode(...new Uint8Array(plaintextBytes))
    plaintext = plaintext.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, '');
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
    const userSession = { ...sessionForRemoteUser(address)! }
    const currentUserId = await getKeychainValueFor(elderlyId)

    //Se for uma mensagem de dados do cuidador e não for uma mensagem nossa (tipo 0)
    if(cm.type === ChatMessageType.PERSONAL_DATA && !itsMine) {
        await processPersonalData(currentUserId, cm)
    } else if (cm.type === ChatMessageType.REJECT_SESSION) {
        await processRejectMessage(currentUserId, cm)
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
    } else if (cm.type === ChatMessageType.DECOUPLING_SESSION && !itsMine) {
        await processDecouplingMessage(currentUserId, cm)
    }/* else if(type !== 3 && !cm.firstMessage) {
    }*/
    
    const sessionList = sessionListSubject.value.filter((session) => session.remoteUsername !== address)
    sessionList.unshift(userSession)
    sessionListSubject.next(sessionList)
    if (currentSessionSubject.value?.remoteUsername === address) {
        currentSessionSubject.next(userSession)
    }
}

async function processPersonalData(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processPersonalDataCalled")
    const data = JSON.parse(cm.body) as CaregiverDataBody
    if (await checkCaregiverByEmail(currentUserId, cm.from)) {  
        await updateCaregiver(data.userId, currentUserId, data.email, data.name, data.phone)
        setCaregiverListUpdated()
        editCompletedFlash(FlashMessage.caregiverPersonalInfoUpdated)
    } else if(await checkCaregiverByEmailNotAccepted(currentUserId, cm.from)) {
        await updateCaregiver(data.userId, currentUserId, data.email, data.name, data.phone)
        .then(() => addCaregiverToArray(currentUserId, data.userId, "readCaregivers"))
        .then(() => sessionAcceptedFlash(cm.from, false))
        .then(() => setCaregiverListUpdated())
    } else {
        await saveCaregiver(currentUserId, data.userId, data.name, data.email, data.phone, CaregiverRequestStatus.RECEIVED.valueOf())
        .then(() => sessionRequestReceivedFlash(cm.from))
        .then(() => setCaregiverListUpdated())
    }
}

async function processRejectMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processRejectMessageCalled")
    const caregiverId = await getCaregiverId(cm.from, currentUserId)
    await deleteCaregiver(currentUserId, cm.from)
    .then(() => removeCaregiverFromArray(currentUserId, caregiverId, 'readCaregivers'))
    .then(() => removeCaregiverFromArray(currentUserId, caregiverId, 'writeCaregivers'))
    sessionRejectedFlash(cm.from, false)
}

async function processDecouplingMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processDecouplingMessageCalled")
    const caregiverId = await getCaregiverId(cm.from, currentUserId)
    //await deleteCaregiver(currentUserId, cm.from)
    removeCaregiverFromArray(currentUserId, caregiverId, 'readCaregivers')
    .then(() => removeCaregiverFromArray(currentUserId, caregiverId, 'writeCaregivers'))
    .then(() => changeCaregiverStatusOnDatabase(currentUserId, cm.from, CaregiverRequestStatus.DECOUPLING))
    .then(() => setCaregiverListUpdated())
    //TODO: depois ao dar reset na lista de caregivers, ao se verificar que um deles está decoupling, apagamos o mesmo e damos reset das chaves.
    sessionEndedFlash(cm.from, false)
}