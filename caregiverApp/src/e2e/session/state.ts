import { BehaviorSubject } from 'rxjs'
import { ChatSession } from './types'

export const sessionListSubject = new BehaviorSubject<ChatSession[]>([])
export const currentSessionSubject = new BehaviorSubject<ChatSession | null>(null)

//Retorna a sessão, caso exista, com o utilizador que se pretende comunicar.
export function sessionForRemoteUser(username: string): ChatSession | undefined {
    return sessionListSubject.value.find((session) => session.remoteUsername === username)
}

//Remove a sessão que existe com determinado utilizador.
export function removeSession(username: string) {
    const sessionList = sessionListSubject.value.filter((session) => session.remoteUsername!== username)
    sessionListSubject.next(sessionList)
}