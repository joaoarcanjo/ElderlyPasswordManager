import { deleteCaregiver } from "../../../database"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType, ElderlyDataBody } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"
import { getValueFor } from "../../../keychain"
import { caregiver1SSSKey, caregiver2SSSKey } from "../../../keychain/constants"

export async function startSessionWithCaregiver(number: number, caregiverEmail: string, userId: string, userName: string, userEmail: string, userPhone: string) {
    await startSession(caregiverEmail)
    const session = sessionForRemoteUser(caregiverEmail)
    currentSessionSubject.next(session ?? null)

    const valueKey = number == 1 ? await getValueFor(caregiver1SSSKey(userId)) :  await getValueFor(caregiver2SSSKey(userId))
    
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

export async function decouplingCaregiver(email: string) {
    //TODO: Enviar notificação a informar do desligamento.
    //TODO: Atualizar a firebase porque o cuidador ja n tem acesso às suas credenciais.
    //TODO: Atualizar na firebase a chave de encriptação.
    //TODO: Enviar para o outro cuidador (caso exista), a sua nova chave.
    //TODO: Apagar os dados do cuidador que se encontram armazenados localmente.
    await deleteCaregiver(email)
}