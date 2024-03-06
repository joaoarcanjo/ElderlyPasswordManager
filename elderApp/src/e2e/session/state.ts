import { BehaviorSubject } from 'rxjs'
import { ChatSession } from './types'

export const sessionListSubject = new BehaviorSubject<ChatSession[]>([])
export const currentSessionSubject = new BehaviorSubject<ChatSession | null>(null)

//Retorna a sessão, caso exista, com o utilizador que se pretende comunicar.
export function sessionForRemoteUser(username: string): ChatSession | undefined {
    const session = sessionListSubject.value.find((session) => session.remoteUsername === username)
    return session
}