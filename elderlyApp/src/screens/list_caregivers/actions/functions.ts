import { startSession } from "../../../e2e/session/functions"
import { currentSessionSubject, sessionForRemoteUser } from "../../../e2e/session/state"

export async function startSessionWithCaregiver(email: string) {
    await startSession(email)
    const session = sessionForRemoteUser(email)
    currentSessionSubject.next(session ?? null)
}