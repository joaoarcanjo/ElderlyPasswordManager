import FormatTimestamp from "../../../algorithms/0thers/time"
import { getCaregivers } from "../../../database/caregivers"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType, CredentialBody } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"

export async function sendCaregiversCredentialInfoAction(userId: string, credentialId: string, platform: string, type: ChatMessageType) {
    const caregivers = await getCaregivers(userId)   
    caregivers.forEach(async (caregiver) => {
        if(!sessionForRemoteUser(caregiver.email)) {
            await startSession(caregiver.email)
            const session = sessionForRemoteUser(caregiver.email)
            currentSessionSubject.next(session ?? null)
        }

        const data: CredentialBody = {
            credentialId: credentialId,
            platform: platform,
        }
        await encryptAndSendMessage(caregiver.email, JSON.stringify(data), false, type) 
    })
}

export function buildEditMessage(userEmail: string) {
    return `Editado por: ${userEmail}, ${FormatTimestamp(Date.now())}`
}