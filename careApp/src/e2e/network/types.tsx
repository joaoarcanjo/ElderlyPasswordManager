export interface WebSocketMessage {
    action: 'sendMessage' | 'subscribe' | 'recent' | 'hey' | 'acknowledge'
}

export interface SendWebSocketMessage extends WebSocketMessage {
    action: 'sendMessage'
    address: string
    from: string
    message: string
}

export interface SendAcknowledgeMessage extends WebSocketMessage {
    action: 'acknowledge'
    address: string
    from: string
    messageId: string
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

export function isAcknowledgeMessage(wsm: WebSocketMessage): wsm is SendWebSocketMessage {
    return ( wsm.action === 'acknowledge')
}

export interface NetworkParams {
    wssURI: string
}