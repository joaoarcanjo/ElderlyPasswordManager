import FormatTimestamp from "../../../algorithms/0thers/time"
import { getElderly } from "../../../database/elderlyFunctions"
import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType, CredentialBody } from "../../../e2e/messages/types"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"

export async function sendElderlyCredentialInfoAction(userId: string, elderlyId: string, credentialId: string, platform: string, type: ChatMessageType) {
    console.log("UserId:", userId)
    console.log("ElderlyId:", elderlyId)
    const elderly = await getElderly(userId, elderlyId)   
    if(!sessionForRemoteUser(elderly.email)) {
        await startSession(elderly.email)
        const session = sessionForRemoteUser(elderly.email)
        currentSessionSubject.next(session ?? null)
    }

    const data: CredentialBody = {
        credentialId: credentialId,
        platform: platform,
    }
    await encryptAndSendMessage(elderly.email, JSON.stringify(data), false, type) 
}

export function buildEditMessage(userEmail: string, timestamp: number) {
    return `Última alteração: ${userEmail}, ${FormatTimestamp(timestamp)}`
}