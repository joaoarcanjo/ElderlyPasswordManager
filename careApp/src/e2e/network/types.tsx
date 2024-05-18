export interface WebSocketMessage {
    action: 'sendMessage' | 'subscribe' | 'recent' | 'hey'
}

export interface SendWebSocketMessage extends WebSocketMessage {
    action: 'sendMessage'
    address: string
    from: string
    message: string
}

export interface SubscribeWebSocketMessage extends WebSocketMessage {
    action: 'subscribe'
    username: string
}

export interface RequestRecentWebsocketMessage extends WebSocketMessage {
    action: 'recent'
    address: string
}

export interface HeyTestMessage extends WebSocketMessage {
    action: 'hey'
    message: string
}

export function isSendWebSocketMessage(wsm: WebSocketMessage): wsm is SendWebSocketMessage {
    return (wsm.action === 'sendMessage' && 'message' in wsm)
}

export interface NetworkParams {
    wssURI: string
}