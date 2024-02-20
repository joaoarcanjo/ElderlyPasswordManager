import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType, PersonalDataBody } from "../../../e2e/messages/types"
import { removeSession } from "../../../e2e/session/state"

//
// ESTAS FUNÇÕES SÃO UTILIZADAS TENDO EM CONTA A DECISÃO DO CUIDADOR QUANDO RECEBE A NOTIFICAÇÃO.
//

/**
 * Quando o cuidador aceita um idoso, é enviada uma mensagem para o idoso a dizer que aceitou a conexão.
 * @param to 
 */
export async function acceptElderly(to: string) {

    //TODO: remove estes valores default e usar valores verdadeiros.
    const data: PersonalDataBody = {
        key: "",
        name: "José Augusto",
        email: "care@g.com",
        phone: "918826447",
        photo: ""
    }
    
    await encryptAndSendMessage(to, 'acceptSession', true, ChatMessageType.ACCEPTED_SESSION)
    await encryptAndSendMessage(to, JSON.stringify(data), true, ChatMessageType.PERSONAL_DATA)
}

/**
 * Quando o cuidador rejeita a relação, é enviada uma mensagem para o idoso a dizer que rejeitou a conexão.
 * O cuidador vai remover a sessão (webSocket) que possui com o idoso.
 * @param to 
 */
export async function refuseElderly(to: string) {
    await encryptAndSendMessage(to, 'rejectSession', true, ChatMessageType.REJECT_SESSION)
    removeSession(to)
}