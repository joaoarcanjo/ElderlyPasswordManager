import { ProcessedChatMessage } from '../messages/types'

export interface ChatSession {
    remoteUsername: string
    messages: ProcessedChatMessage[]
}