import { SubscribeWebSocketMessage, WebSocketMessage } from './types'
import { Subscription } from 'rxjs'
import { WebSocketSubject } from 'rxjs/webSocket'

let signalWebsocket: WebSocketSubject<WebSocketMessage>
let websocketSub: Subscription

function setSignalWebsocket(sws: WebSocketSubject<WebSocketMessage>): void {
    signalWebsocket = sws
}

function setWebsocketSubscription(sub: Subscription): void {
    websocketSub = sub
}

function subscribeWebsocket(username: string): void {
    const wsm: SubscribeWebSocketMessage = {
        action: 'subscribe',
        username: username,
    }
    signalWebsocket.next(wsm)
}

function closeWebsocket(): void {
    websocketSub.unsubscribe()
}

export { signalWebsocket, setSignalWebsocket, setWebsocketSubscription, subscribeWebsocket, closeWebsocket }