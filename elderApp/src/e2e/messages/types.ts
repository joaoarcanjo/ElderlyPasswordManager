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
    PERSONAL_DATA, //mensagem enviada com os primeiros dados (chave + others)
    PERMISSION_DATA, //mensagem que indica que houve atualização de permissões

    START_SESSION, //primeira mensagem enviada (quando se começa a sessão)
    REJECT_SESSION, //mensagem enviada quando o outro membro aceita
    DECOUPLING_SESSION, //mensagem enviada quando o outro membro desvincula

    CREDENTIALS_UPDATED,
    CREDENTIALS_DELETED,
    CREDENTIALS_CREATED,
}

export interface ElderlyDataBody {
    userId: string,
    key: string,
    name: string,
    email: string,
    phone: string,
    photo: string
}

export interface CaregiverDataBody {
    userId: string,
    name: string,
    email: string,
    phone: string,
    photo: string
}

export interface CredentialBody {
    credentialId: string,
    platform: string
}