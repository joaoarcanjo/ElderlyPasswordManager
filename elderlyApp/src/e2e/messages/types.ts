export interface ProcessedChatMessage {
    id: string
    address: string
    from: string
    timestamp: number
    firstMessage: boolean
    body: string
}