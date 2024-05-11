export interface WebSocketMessage {
    action: 'sendMessage' | 'subscribe' | 'recent' | 'sendBundle'
}

export enum WebSocketMessageType {
    SEND_MESSAGE = 'sendMessage',
    SUBSCRIBE = 'subscribe',
    RECENT = 'recent',
}

export interface SendWebSocketMessage extends WebSocketMessage {
    action: 'sendMessage'
    address: string
    from: string
    message: string
}

export interface SendBundleMessage extends WebSocketMessage {
    action: 'sendBundle'
    address: string
    from: string
    message: any
}

export interface SubscribeWebSocketMessage extends WebSocketMessage {
    action: 'subscribe'
    username: string
}

export interface RequestRecentWebsocketMessage extends WebSocketMessage {
    action: 'recent'
    address: string
}

export function isSendWebSocketMessage(wsm: WebSocketMessage): wsm is SendWebSocketMessage {
    return (wsm.action === 'sendMessage' && 'message' in wsm)
}

export interface NetworkParams {
    wssURI: string
}
