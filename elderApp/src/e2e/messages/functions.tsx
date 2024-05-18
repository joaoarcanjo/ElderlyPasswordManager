import { MessageType, SessionCipher, SignalProtocolAddress } from "@privacyresearch/libsignal-protocol-typescript"
import { currentSessionSubject, removeSession, sessionForRemoteUser, sessionListSubject } from "../session/state"
import { signalStore, usernameSubject } from "../identity/state"
import { ChatSession } from "../session/types"
import { ChatMessageType, CaregiverDataBody, ProcessedChatMessage, CredentialBody, ElderlyDataBody, ChatMessageDescription } from "./types"
import { setCaregiverListUpdated } from "../../screens/list_caregivers/actions/state"
import { getKeychainValueFor } from "../../keychain"
import { caregiver1SSSKey, caregiver2SSSKey, elderlyId, localDBKey } from "../../keychain/constants"
import { addCaregiverToArray, removeCaregiverFromArray } from "../../firebase/firestore/functionalities"
import { checkCaregiverByEmailAccepted, checkCaregiverByEmailNotAccepted, checkNumberOfCaregivers, deleteCaregiver, getCaregiverId, getCaregivers, getCaregiversWithSpecificState, isMaxCaregiversReached, saveCaregiver, updateCaregiver } from "../../database/caregivers"
import { CaregiverRequestStatus } from "../../database/types"
import { setCredentialsListUpdated } from "../../screens/list_credentials/actions/state"
import { getAllCredentialsAndValidate } from "../../screens/list_credentials/actions/functions"
import { encryptAndSendMessage } from "./sendMessage"
import { caregiverPersonalInfoUpdatedFlash, credentialCreatedFlash, credentialDeletedFlash, credentialUpdatedFlash, sessionAcceptedFlash, sessionEndedFlash, sessionRejectMaxReachedFlash, sessionRejectedFlash, sessionRejectedMaxReachedFlash, sessionRequestCanceledFlash, sessionRequestReceivedFlash } from "../../components/UserMessages"
import { deleteSessionById } from "../../database/signalSessions"
import { executeKeyExchange } from "../../algorithms/shamirSecretSharing/sssOperations"
import { emptyValue, readCaregivers, writeCaregivers } from "../../assets/constants/constants"

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
        plaintext = plaintext.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, emptyValue)
        cm = JSON.parse(plaintext) as ProcessedChatMessage
        addMessageToSession(address, cm, type)
    } catch (e) {
        //console.log(e) //TODO: Verificar se é necessário realizar algum alerta
    }
}

/**
 * Função para processar uma mensagem recebida de tipo 1
 * @param address Representa o identificador de quem enviou a mensagem.
 * @param message Conteúdo da mensagem enviada.
 */
export async function processRegularMessage(address: string, message: string, type: number): Promise<void> {
    console.log('-> processRegularMessage')
    try {
        /*const userSession = { ...sessionForRemoteUser(address)! }
        if(!userSession.remoteUsername) {
            const session : ChatSession= sessionForRemoteUser(address) || {
                remoteUsername: address,
                messages: [],
            }
            const sessionList = [...sessionListSubject.value]
            sessionList.unshift(session)
            sessionListSubject.next(sessionList)
        }*/
        
        const protocolAddress = new SignalProtocolAddress(address, 1)
        const cipher = new SessionCipher(signalStore, protocolAddress)
        
        const plaintextBytes = await cipher.decryptWhisperMessage(message, 'binary')
        
        let plaintext = String.fromCharCode(...new Uint8Array(plaintextBytes))
        plaintext = plaintext.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, emptyValue);
        const cm: ProcessedChatMessage = JSON.parse(plaintext)
        addMessageToSession(address, cm, type)
    } catch (error) {
        console.error('Error processing message:', error)
    }
}

export async function addMessageToSession(address: string, cm: ProcessedChatMessage, type: number, itsMine?: boolean): Promise<void> {
    const userSession = { ...sessionForRemoteUser(address)! }

    const currentUserId = await getKeychainValueFor(elderlyId)
    const localKey = await getKeychainValueFor(localDBKey(currentUserId))

    //Se for uma mensagem de dados do cuidador e não for uma mensagem nossa (tipo 0)
    if(cm.type === ChatMessageType.PERSONAL_DATA && !itsMine) {
        await processPersonalData(currentUserId, cm)
    } else if (cm.type === ChatMessageType.REJECT_SESSION) {
        await processRejectMessage(currentUserId, cm)
    } else if (cm.type === ChatMessageType.CANCEL_SESSION && !itsMine) {
        //vai apagar a sessão que foi criada com o possível cuidador
        await processCancelSession(currentUserId, cm)
    } else if (cm.type === ChatMessageType.MAX_REACHED_SESSION && !itsMine) {
        //vai apagar a sessão que foi criada com o possível cuidador
        await processMaxReachedMessage(currentUserId, cm)
    } else if (cm.type === ChatMessageType.CREDENTIALS_UPDATED && !itsMine) {
        const data = JSON.parse(cm.body) as CredentialBody
        credentialUpdatedFlash(cm.from, data.platform, false)
        await getAllCredentialsAndValidate(currentUserId, localKey)
        setCredentialsListUpdated() 
    } else if (cm.type === ChatMessageType.CREDENTIALS_CREATED && !itsMine) {
        const data = JSON.parse(cm.body) as CredentialBody
        credentialCreatedFlash(cm.from, data.platform, false)
        await getAllCredentialsAndValidate(currentUserId, localKey)
        setCredentialsListUpdated()
    } else if (cm.type === ChatMessageType.CREDENTIALS_DELETED && !itsMine) {
        const data = JSON.parse(cm.body) as CredentialBody
        credentialDeletedFlash(cm.from, data.platform, false)
        await getAllCredentialsAndValidate(currentUserId, localKey)
        setCredentialsListUpdated()
    } else if (cm.type === ChatMessageType.DECOUPLING_SESSION && !itsMine) {
        await processDecouplingMessage(currentUserId, cm)
    }
    
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
    
    //Se for uma relação já aceite, o cuidador quer atualizar os seus dados locais.
    if (await checkCaregiverByEmailAccepted(currentUserId, cm.from)) {  
        await updateCaregiver(data.userId, currentUserId, data.email, data.name, data.phone)
        .then(() => setCaregiverListUpdated(currentUserId))
        .then(() =>  caregiverPersonalInfoUpdatedFlash(data.email))
        .catch(() => console.log('#1 Error updating caregiver'))
    
    //Se for uma relação que estamos à espera de resposta, o cuidador aceitou a relação.
    } else if(await checkCaregiverByEmailNotAccepted(currentUserId, cm.from)) {
        await updateCaregiver(data.userId, currentUserId, data.email, data.name, data.phone)
        .then(() => addCaregiverToArray(currentUserId, data.userId, readCaregivers))
        .then(() => sessionAcceptedFlash(cm.from, false))
        .then(() => setCaregiverListUpdated(currentUserId))
        .then(() => sendCaregiverShare(currentUserId, cm.from))
        .then(() => cancelWaitingCaregivers(currentUserId))
        .catch(() => console.log('#1 Error updating caregiver'))

    //Significa que o cuidador está a enviar um pedido para iniciar uma relação
    } else {
        await isMaxCaregiversReached(currentUserId)
        .then(async (isMaxReached) => {
            if(isMaxReached) await refuseCaregiverMaxReached(currentUserId, cm)
            else {
                await saveCaregiver(currentUserId, data.userId, data.name, data.email, data.phone, CaregiverRequestStatus.RECEIVED)
                .then(() => sessionRequestReceivedFlash(cm.from))
                .then(() => setCaregiverListUpdated(currentUserId))
                .catch(() => console.log('#1 Error saving caregiver'))
            }
        })
        .catch(() => console.log('#1 Error checking if max caregivers reached'))
    }
}

async function refuseCaregiverMaxReached(currentUserId: string, cm: ProcessedChatMessage) {
    await encryptAndSendMessage(cm.from, ChatMessageDescription.REJECT_SESSION, true, ChatMessageType.MAX_REACHED_SESSION)
    .then(() => removeSession(cm.from))
    .then(() => deleteSessionById(currentUserId, cm.from))
    .then(() => sessionRejectMaxReachedFlash(cm.from))    
}

export async function processCancelSession(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processCancelRequestCalled")
    await deleteCaregiver(currentUserId, cm.from)
    .then(() => deleteSessionById(currentUserId, cm.from))
    .then(() => sessionRequestCanceledFlash(cm.from, false))
    .then(() => setCaregiverListUpdated(currentUserId))
    .catch(() => console.log('#1 Error canceling caregiver request'))
}

async function processRejectMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processRejectMessageCalled")
    await deleteCaregiver(currentUserId, cm.from)
    .then(() => sessionRejectedFlash(cm.from, false))
    .then(() => deleteSessionById(currentUserId, cm.from))
    .then(() => setCaregiverListUpdated(currentUserId))
    .catch(() => console.log('#1 Error deleting caregiver'))
}

async function processDecouplingMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processDecouplingMessageCalled")
    const caregiverId = await getCaregiverId(cm.from, currentUserId)
    await deleteCaregiver(currentUserId, cm.from)
    .then(() => removeCaregiverFromArray(currentUserId, caregiverId, writeCaregivers))
    .then(() => removeCaregiverFromArray(currentUserId, caregiverId, readCaregivers))
    .then(() => setCaregiverListUpdated(currentUserId))
    .then(() => sessionEndedFlash(cm.from, false))
    .then(() => executeKeyExchange(currentUserId))
    .then(() => deleteSessionById(currentUserId, cm.from))
    .catch(() => console.log('#1 Error decoupling caregiver'))
}

async function processMaxReachedMessage(currentUserId: string, cm: ProcessedChatMessage) {
    console.log("===> processMaxReachedMessageCalled")
    await deleteCaregiver(currentUserId, cm.from)
    .then(() => sessionRejectedMaxReachedFlash(cm.from))
    .then(() => deleteSessionById(currentUserId, cm.from))
    .then(() => setCaregiverListUpdated(currentUserId))
    .catch(() => console.log('#1 Error deleting caregiver'))
}

export async function cancelWaitingCaregivers(userId: string) {
    console.log("===> cancelWaitingCaregiversCalled")
    console.log(await getCaregivers(userId))
    const elderlies = await getCaregiversWithSpecificState(userId, CaregiverRequestStatus.WAITING)
    elderlies.forEach(async email => {
        await encryptAndSendMessage(email, ChatMessageDescription.CANCEL_SESSION, true, ChatMessageType.CANCEL_SESSION)
        .then(() => removeSession(email))
        .then(() => deleteCaregiver(userId, email))
        .then(() => setCaregiverListUpdated(userId))
    })
}

export async function cancelWaitingCaregiver(userId: string, caregiverEmail: string) {
    console.log("===> cancelWaitingCaregiverCalled")
    await encryptAndSendMessage(caregiverEmail, ChatMessageDescription.CANCEL_SESSION, true, ChatMessageType.CANCEL_SESSION)
    .then(() => removeSession(caregiverEmail))
    .then(() => deleteCaregiver(userId, caregiverEmail))
    .then(() => deleteSessionById(userId, caregiverEmail))
    .then(() => setCaregiverListUpdated(userId))
}

async function sendCaregiverShare(currentUserId: string, to: string) {
    console.log("===> sendCaregiverShareCalled")
    const numberOfCaregivers = await checkNumberOfCaregivers(currentUserId)
    const caregiver1Key = await getKeychainValueFor(caregiver1SSSKey(currentUserId))
    const caregiver2Key = await getKeychainValueFor(caregiver2SSSKey(currentUserId)) 
    const valueKey = numberOfCaregivers == 0 ? caregiver1Key : caregiver2Key
    const data: ElderlyDataBody = {
        userId: currentUserId,
        key: valueKey,
        name: emptyValue,
        email: emptyValue,
        phone: emptyValue,
        photo: emptyValue
    }
    await encryptAndSendMessage(to, JSON.stringify(data), false, ChatMessageType.KEY_UPDATE)
}