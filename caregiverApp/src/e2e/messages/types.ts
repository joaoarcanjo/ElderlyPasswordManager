export interface ProcessedChatMessage {
    id: string
    address: string
    from: string
    timestamp: number
    firstMessage: boolean
    body: string
    type: ChatMessageType
}

export enum ChatMessageType {
    NORMAL_DATA, //mensagem normal (texto)
    START_SESSION, //primeira mensagem enviada (quando se começa a sessão)
    PERSONAL_DATA, //mensagem enviada com os primeiros dados (chave + others)
    REJECT_SESSION, //mensagem enviada quando o outro membro aceita
}

export interface PersonalDataBody {
    key: string,
    name: string,
    email: string,
    phone: string,
    photo: string
}