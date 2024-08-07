import { executeKeyExchange } from "../../../algorithms/shamirSecretSharing/sssOperations"
import { emptyValue, readCaregivers, writeCaregivers } from "../../../assets/constants/constants"
import { changeCaregiverStatusOnDatabase, deleteCaregiver, getCaregiversWithSpecificState, isMaxCaregiversReached } from "../../../database/caregivers"
import { deleteSessionById } from "../../../database/signalSessions"
import { CaregiverRequestStatus } from "../../../database/types"
import { encryptAndSendMessage } from "../../../e2e/messages/sendMessage"
import { ChatMessageDescription, ChatMessageType, ElderlyDataBody } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, removeSession, sessionForRemoteUser } from "../../../e2e/session/state"
import { ErrorInstance } from "../../../exceptions/error"
import { Errors } from "../../../exceptions/types"
import { addCaregiverToArray, removeCaregiverFromArray } from "../../../firebase/firestore/functionalities"
import { getKeychainValueFor } from "../../../keychain"
import { caregiver1SSSKey, caregiver2SSSKey } from "../../../keychain/constants"
import { sessionAcceptedFlash, sessionEndedFlash, sessionRejectedFlash } from "../../../notifications/UserMessages"
import { setCaregiverListUpdated } from "./state"

export async function startSessionWithCaregiver(caregiverEmail: string, userId: string, userName: string, userEmail: string, userPhone: string) {
    console.log("===> startSessionWithCaregiverCalled")
    try {
        console.log(caregiverEmail)
        console.log("AHAHHAHAHAHAHA")
        await startSession(caregiverEmail)
        console.log("AHAHHAHAHAHAHA")
        const session = sessionForRemoteUser(caregiverEmail)
        currentSessionSubject.next(session ?? null)

    
        const data: ElderlyDataBody = {
            userId: userId,
            key: emptyValue,
            name: userName,
            email: userEmail,
            phone: userPhone,
            photo: emptyValue
        }
        await encryptAndSendMessage(caregiverEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA) 
    } catch (error) {
        console.log(error)
        return Promise.reject(new ErrorInstance(Errors.ERROR_STARTING_SESSION))
        //FAZER UM ALERT PARA ISTO?
    }
}
/**
 * Quando o idoso aceita o cuidador, é enviada uma mensagem para o cuidador a dizer que aceitou a conexão.
 * @param to 
 */
export async function acceptCaregiver(caregiverId: string, number: number, userId: string, caregiverEmail: string, userName: string, userEmail: string, userPhone: string) {

    const session = sessionForRemoteUser(caregiverEmail)
    currentSessionSubject.next(session || null)

    const valueKey = number == 1 ? await getKeychainValueFor(caregiver1SSSKey(userId)) :  await getKeychainValueFor(caregiver2SSSKey(userId))

    const data: ElderlyDataBody = {
        userId: userId,
        key: valueKey,
        name: userName,
        email: userEmail,
        phone: userPhone,
        photo: emptyValue
    }
    
    await changeCaregiverStatusOnDatabase(userId, caregiverEmail, CaregiverRequestStatus.ACCEPTED.valueOf())
    .then(() => encryptAndSendMessage(caregiverEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA))
    .then(() => cancelWaitingCaregivers(userId))
    .then(() => addCaregiverToArray(userId, caregiverId, readCaregivers))
    .then(() => sessionAcceptedFlash(caregiverEmail, true))
    .then(() => refuseIfMaxReached(userId))
}

/**
 * Quando o idoso rejeita a relação, é enviada uma mensagem para o cuidador a dizer que rejeitou a conexão.
 * O idoso vai remover a sessão (webSocket) que possui com o cuidador.
 * @param to 
 */
export async function refuseCaregiver(userId: string, to: string, elderlyName: string) {
    console.log("===> refuseCaregiverCalled")
    await deleteCaregiver(userId, to)
    .then(() => encryptAndSendMessage(to, ChatMessageDescription.REJECT_SESSION, true, ChatMessageType.REJECT_SESSION))
    .then(() => removeSession(to))
    .then(() => deleteSessionById(userId, to))
    .then(() => sessionRejectedFlash(to, true))
    .then(() => setCaregiverListUpdated(userId))
    .catch(() => console.log('#1 Error refusing caregiver'))
}

/**
 * This function is to cancel the requests that were made to other caregivers.
 * @param userId 
 */
export async function cancelWaitingCaregivers(userId: string) {
    const elderlies = await getCaregiversWithSpecificState(userId, CaregiverRequestStatus.WAITING.valueOf())
    elderlies.forEach(async email => {
        await encryptAndSendMessage(email, ChatMessageDescription.REJECT_SESSION, true, ChatMessageType.CANCEL_SESSION)
        .then(() => removeSession(email))
        .then(() => deleteCaregiver(userId, email))
        .then(() => setCaregiverListUpdated(userId))
    })
}


export async function decouplingCaregiver(caregiverEmail: string, caregiverId: string, userId: string) {
    console.log("===> decouplingCaregiverCalled")
    return await deleteCaregiver(userId, caregiverEmail)
    .then(() => deleteSessionById(userId, caregiverId))
    .then(() => removeCaregiverFromArray(userId, caregiverId, writeCaregivers)) 
    .then(() => removeCaregiverFromArray(userId, caregiverId, readCaregivers))
    .then(() => sendCaregiversDecoupling(caregiverEmail))
    .then(() => sessionEndedFlash(caregiverEmail, true))
    .then(() => executeKeyExchange(userId))
    .catch(() => console.log('#1 Error decoupling caregiver'))
}

async function sendCaregiversDecoupling(caregiverEmail: string) {
    if(!sessionForRemoteUser(caregiverEmail)) {
        await startSession(caregiverEmail)
        const session = sessionForRemoteUser(caregiverEmail)
        currentSessionSubject.next(session ?? null)
    }
    await encryptAndSendMessage(caregiverEmail, emptyValue, false, ChatMessageType.DECOUPLING_SESSION) 
}

export async function refuseIfMaxReached(userId: string) {
    await isMaxCaregiversReached(userId)
    .then(async (isMaxReached) => {
        if(isMaxReached) {
            const waitingElderlyEmails = await getCaregiversWithSpecificState(userId, CaregiverRequestStatus.RECEIVED.valueOf())
            waitingElderlyEmails.forEach(async email => {
                await encryptAndSendMessage(email, ChatMessageDescription.REJECT_SESSION, true, ChatMessageType.MAX_REACHED_SESSION)
                .then(() => removeSession(email))
                .then(() => deleteCaregiver(userId, email))
                .then(() => setCaregiverListUpdated(userId))
            })
        }
    })
    .catch(() => console.log('#1 Error checking if max caregivers reached'))
}