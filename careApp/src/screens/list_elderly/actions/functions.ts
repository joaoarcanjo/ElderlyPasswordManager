import { emptyValue } from "../../../assets/constants/constants"
import { acceptElderlyOnDatabase, deleteElderly, getElderlyWithSpecificState, isMaxElderlyReached } from "../../../database/elderly"
import { deleteSessionById } from "../../../database/signalSessions"
import { ElderlyRequestStatus } from "../../../database/types"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { CaregiverDataBody, ChatMessageType, ChatMessageDescription } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { sessionForRemoteUser, currentSessionSubject, removeSession } from "../../../e2e/session/state"
import { ErrorInstance } from "../../../exceptions/error"
import { Errors } from "../../../exceptions/types"
import { sessionAcceptedFlash, sessionRejectedFlash } from "../../../notifications/UserMessages"
import { setElderlyListUpdated } from "./state"

//
// ESTAS FUNÇÕES SÃO UTILIZADAS TENDO EM CONTA A DECISÃO DO CUIDADOR QUANDO RECEBE A NOTIFICAÇÃO.
//

export async function startSessionWithElderly(elderlyEmail: string, userId: string, userName: string, userEmail: string, userPhone: string) {
    try {
        await startSession(elderlyEmail)
        const session = sessionForRemoteUser(elderlyEmail)
        currentSessionSubject.next(session ?? null)

        const data: CaregiverDataBody = {
            userId: userId,
            name: userName,
            email: userEmail,
            phone: userPhone,
            photo: ""
        }

        await encryptAndSendMessage(elderlyEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA) 

    } catch (error) {
        console.log(error)
        return Promise.reject(new ErrorInstance(Errors.ERROR_STARTING_SESSION))
        //FAZER UM ALERT PARA ISTO?
    }
}

/**
 * Quando o cuidador aceita um idoso, é enviada uma mensagem para o idoso a dizer que aceitou a conexão.
 * @param to 
 */
export async function acceptElderly(userId: string, elderlyEmail: string, userName: string, userEmail: string, userPhone: string) {

    const session = sessionForRemoteUser(elderlyEmail)
    currentSessionSubject.next(session || null)
    const data: CaregiverDataBody = {
        userId: userId,
        name: userName,
        email: userEmail,
        phone: userPhone,
        photo: ""
    }
    //await encryptAndSendMessage(to, 'acceptSession', true, ChatMessageType.ACCEPTED_SESSION)
    await encryptAndSendMessage(elderlyEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA)
    await acceptElderlyOnDatabase(userId, elderlyEmail)
    .then(() => cancelWaitingElderly(userId, elderlyEmail))
    .then(() => sessionAcceptedFlash(emptyValue, true))
    .then(() => setElderlyListUpdated())
    .then(() => refuseIfMaxReached(userId))
    
}

/**
 * Quando o cuidador rejeita a relação, é enviada uma mensagem para o idoso a dizer que rejeitou a conexão.
 * O cuidador vai remover a sessão (webSocket) que possui com o idoso.
 * @param to 
 */
export async function refuseElderly(userId: string, to: string) {
    await deleteElderly(userId, to)
    .then(() => encryptAndSendMessage(to, ChatMessageDescription.REJECT_SESSION, true, ChatMessageType.REJECT_SESSION))
    .then(() => removeSession(to))
    .then(() => deleteSessionById(userId, to))
    .then(() => setElderlyListUpdated())
    .then(() => sessionRejectedFlash(emptyValue, true))
    .catch(() => console.log('#1 Error refusing elderly'))
}

/**
 * This function is to cancel the requests that were made to other caregivers.
 * @param userId 
 */
export async function cancelWaitingElderly(userId: string, to: string) {
    const elderlies = await getElderlyWithSpecificState(userId, ElderlyRequestStatus.WAITING.valueOf())
    elderlies.forEach(async email => {
        await encryptAndSendMessage(email, ChatMessageDescription.REJECT_SESSION, true, ChatMessageType.CANCEL_SESSION)
        .then(() => removeSession(email))
        .then(() => deleteSessionById(userId, to))
        .then(() => deleteElderly(userId, email))
        .then(() => setElderlyListUpdated())
    })
}



/**
 * Todas as ações que têm que ser realizadas quando se realiza a desvinculação do idoso.
 * @param email 
 */
export async function decouplingElderly(userId: string, email: string) {
    await deleteElderly(userId, email)
    .then(() => sendElderlyDecoupling(email))
    .catch(() => console.log('#1 Error decoupling elderly'))

}

async function sendElderlyDecoupling(elderlyEmail: string) {
    if(!sessionForRemoteUser(elderlyEmail)) {
        await startSession(elderlyEmail)
        const session = sessionForRemoteUser(elderlyEmail)
        currentSessionSubject.next(session ?? null)
    }
    await encryptAndSendMessage(elderlyEmail, emptyValue, false, ChatMessageType.DECOUPLING_SESSION) 
}

export async function refuseIfMaxReached(userId: string) {
    const isMaxReached = await isMaxElderlyReached(userId)
    if(isMaxReached) {
        const waitingElderlyEmails = await getElderlyWithSpecificState(userId, ElderlyRequestStatus.RECEIVED.valueOf())
        waitingElderlyEmails.forEach(async email => {
            await encryptAndSendMessage(email, ChatMessageDescription.REJECT_SESSION, true, ChatMessageType.MAX_REACHED_SESSION)
            .then(() => removeSession(email))
            .then(() => deleteElderly(userId, email))
            .then(() => setElderlyListUpdated())
            //.then(() => sessionRejectMaxReachedFlash(email)) NOTE: coloca-se sobre a outra verde de aceitação
        })
    }
}