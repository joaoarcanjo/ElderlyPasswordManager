import { encryptAndSendMessage } from "../../../e2e/messages/functions"
import { ChatMessageType } from "../../../e2e/messages/types"

export async function acceptElderly(to: string) {
    //TODO: criar no sql a identidade do idoso com o email, sendo os outros valores default
    //Os restantes valores serao preenchidos com a informação que o idoso vai enviar à posteriori.
    await encryptAndSendMessage(to, 'acceptSession', true, ChatMessageType.ACCEPTED_SESSION)
}

export async function refuseElderly(to: string) {
    await encryptAndSendMessage(to, 'rejectSession', true, ChatMessageType.REJECT_SESSION)
    //TODO: remover a sessão, para que se possa repetir o pedido de conexao.
}