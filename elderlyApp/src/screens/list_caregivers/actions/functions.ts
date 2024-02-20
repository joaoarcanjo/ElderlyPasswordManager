import { deleteCaregiver } from "../../../database"
import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"

export async function startSessionWithCaregiver(email: string) {
    await startSession(email)
    const session = sessionForRemoteUser(email)
    currentSessionSubject.next(session ?? null)
}

export async function decouplingCaregiver(email: string) {
    //TODO: Enviar notificação a informar do desligamento.
    //TODO: Atualizar a firebase porque o cuidador ja n tem acesso às suas credenciais.
    //TODO: Atualizar na firebase a chave de encriptação.
    //TODO: Enviar para o outro cuidador (caso exista), a sua nova chave.
    //TODO: Apagar os dados do cuidador que se encontram armazenados localmente.
    await deleteCaregiver(email)
}