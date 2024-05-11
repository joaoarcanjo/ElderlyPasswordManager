import { emptyValue } from "../../assets/constants/constants"
import { getCaregivers } from "../../database/caregivers"
import { encryptAndSendMessage } from "../../e2e/messages/sendMessage"
import { ElderlyDataBody, ChatMessageType } from "../../e2e/messages/types"
import { startSession } from "../../e2e/session/functions"
import { sessionForRemoteUser, currentSessionSubject } from "../../e2e/session/state"

/**
 * This function is used to send shares to caregivers.
 * @param userId 
 * @param caregiver1Key 
 * @param caregiver2Key 
 */
export const sendShares = async (userId: string, caregiver1Key: string, caregiver2Key: string) => {
    console.log("===> sendSharesCalled")
    const caregivers = await getCaregivers(userId)
    caregivers.forEach(async (caregiver, index) => {
        if(!sessionForRemoteUser(caregiver.email)) {
            await startSession(caregiver.email)
            const session = sessionForRemoteUser(caregiver.email)
            currentSessionSubject.next(session ?? null)
        }

        if (index > 1) return
        const valueKey = index == 0 ? caregiver1Key : caregiver2Key

        const data: ElderlyDataBody = {
            userId: userId,
            key: valueKey,
            name: emptyValue,
            email: emptyValue,
            phone: emptyValue,
            photo: emptyValue
        }
        await encryptAndSendMessage(caregiver.email, JSON.stringify(data), false, ChatMessageType.KEY_UPDATE)
    }) 
}