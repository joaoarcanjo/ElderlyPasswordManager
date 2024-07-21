import FormatTimestamp from "../../../components/time"
import { getAllCaregivers } from "../../../database/caregivers"
import { encryptAndSendMessage } from "../../../e2e/messages/sendMessage"
import { ChatMessageType, CredentialBody } from "../../../e2e/messages/types"

export async function sendCaregiversCredentialInfoAction(userId: string, credentialId: string, platform: string, type: ChatMessageType) {
    console.log("===> sendCaregiversCredentialInfoActionCalled")
    const caregivers = await getAllCaregivers(userId)
    caregivers.forEach(async (caregiver) => {
        /*if(!sessionForRemoteUser(caregiver.email)) {
            await startSession(caregiver.email)
            const session = sessionForRemoteUser(caregiver.email)
            currentSessionSubject.next(session ?? null)
        }*/

        const data: CredentialBody = {
            credentialId: credentialId,
            platform: platform,
        }
        await encryptAndSendMessage(caregiver.email, JSON.stringify(data), false, type) 
    })
}

export function buildEditMessage(userEmail: string, timestamp: number) {
    return `Última alteração: ${userEmail}, ${FormatTimestamp(timestamp)}`
}