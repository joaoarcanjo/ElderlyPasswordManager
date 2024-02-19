import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType } from "../../../e2e/messages/types"
import { removeSession } from "../../../e2e/session/state"

//
// ESTAS FUNÇÕES SÃO UTILIZADAS TENDO EM CONTA A DECISÃO DO CUIDADOR QUANDO RECEBE A NOTIFICAÇÃO.
//

/**
 * Quando o cuidador aceita um idoso, é enviada uma mensagem para o idoso a dizer que aceitou a conexão.
 * @param to 
 */
export async function acceptElderly(to: string) {
    //TODO: criar no sql a identidade do idoso com o email, sendo os outros valores default
    //Os restantes valores serao preenchidos com a informação que o idoso vai enviar à posteriori.
    await encryptAndSendMessage(to, 'acceptSession', true, ChatMessageType.ACCEPTED_SESSION)
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