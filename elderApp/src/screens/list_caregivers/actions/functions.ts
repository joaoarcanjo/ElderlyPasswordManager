import { deleteCaregiver } from "../../../database/caregivers"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType, ElderlyDataBody } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"
import { removeCaregiverFromArray } from "../../../firebase/firestore/functionalities"
import { getKeychainValueFor } from "../../../keychain"
import { caregiver1SSSKey, caregiver2SSSKey, elderlyId, elderlyPhone, firestoreSSSKey } from "../../../keychain/constants"

export async function startSessionWithCaregiver(number: number, caregiverEmail: string, userId: string, userName: string, userEmail: string, userPhone: string) {
    await startSession(caregiverEmail)
    const session = sessionForRemoteUser(caregiverEmail)
    currentSessionSubject.next(session ?? null)

    const valueKey = number == 1 ? await getKeychainValueFor(caregiver1SSSKey(userId)) :  await getKeychainValueFor(caregiver2SSSKey(userId))

    const data: ElderlyDataBody = {
        userId: userId,
        key: valueKey,
        name: userName,
        email: userEmail,
        phone: userPhone,
        photo: ""
    }

    await encryptAndSendMessage(caregiverEmail, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA) 
}

export async function decouplingCaregiver(caregiverEmail: string, caregiverId: string, userId: string) {
    await sendCaregiversDecoupling(caregiverEmail)
    await removeCaregiverFromArray(elderlyId, caregiverId, 'writeCaregivers')
    await removeCaregiverFromArray(elderlyId, caregiverId, 'readCaregivers')

    //TODO: Atualizar na firebase a chave de encriptação.
    //TODO: Enviar para o outro cuidador (caso exista), a sua nova chave.
    await deleteCaregiver(caregiverEmail)
}

async function sendCaregiversDecoupling(caregiverEmail: string) {
    //TODO: Enviar notificação a informar do desligamento se ele estiver offline.
    if(!sessionForRemoteUser(caregiverEmail)) {
        await startSession(caregiverEmail)
        const session = sessionForRemoteUser(caregiverEmail)
        currentSessionSubject.next(session ?? null)
    }
    await encryptAndSendMessage(caregiverEmail, '', false, ChatMessageType.DECOUPLING_SESSION) 
}