
import { emptyValue } from "../../../assets/constants/constants";
import { getAllElderly } from "../../../database/elderly";
import { encryptAndSendMessage } from "../../../e2e/messages/functions";
import { ChatMessageType, CaregiverDataBody } from "../../../e2e/messages/types";
import { startSession } from "../../../e2e/session/functions";
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state";


export async function sendElderlyNewInfo(userId: string, username: string, userEmail: string, userPhone: string) {
    const elderlyList = await getAllElderly(userId)   
    elderlyList.forEach(async (elderly) => {
        if(!sessionForRemoteUser(elderly.email)) {
            await startSession(elderly.email)
            const session = sessionForRemoteUser(elderly.email)
            currentSessionSubject.next(session ?? null)
        }

        const data: CaregiverDataBody = {
            userId: userId,
            name: username,
            email: userEmail,
            phone: userPhone,
            photo: emptyValue
        }
        
        await encryptAndSendMessage(elderly.email, JSON.stringify(data), false, ChatMessageType.PERSONAL_DATA) 
    })
}
  