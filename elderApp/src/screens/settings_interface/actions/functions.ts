import { emptyValue } from "../../../assets/constants/constants";
import { getAllCaregivers } from "../../../database/caregivers";
import { encryptAndSendMessage } from "../../../e2e/messages/sendMessage";
import { ChatMessageType, ElderlyDataBody } from "../../../e2e/messages/types";
import { startSession } from "../../../e2e/session/functions";
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state";

export async function sendCaregiversNewInfo(userId: string, username: string, userEmail: string, userPhone: string) {
    console.log("===> sendCaregiversNewInfoCalled")
    const caregivers = await getAllCaregivers(userId)   
    caregivers.forEach(async (caregiver) => {
        if(!sessionForRemoteUser(caregiver.email)) {
            await startSession(caregiver.email)
            const session = sessionForRemoteUser(caregiver.email)
            currentSessionSubject.next(session ?? null)
        }

        const data: ElderlyDataBody = {
            userId: userId,
            key: emptyValue,
            name: username,
            email: userEmail,
            phone: userPhone,
            photo: emptyValue
        }
        
        await encryptAndSendMessage(caregiver.email, JSON.stringify(data), false, ChatMessageType.PERSONAL_DATA) 
    })
}
  