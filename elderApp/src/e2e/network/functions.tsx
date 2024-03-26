import { Subscription } from "rxjs"
import { setSignalWebsocket, setWebsocketSubscription, signalWebsocket } from "./webSockets"
import { webSocket } from "rxjs/webSocket"
import { SendWebSocketMessage, WebSocketMessage, isSendWebSocketMessage, isAcknowledgeMessage } from "./types"
import { MessageType } from "@privacyresearch/libsignal-protocol-typescript"
import { processRegularMessage, processPreKeyMessage } from "../messages/functions"
//import { MessageType } from "../../algorithms/signal"

/**
 * Recebe o uri do servidor e cria uma subscrição no mesmo, que significa uma sessão com o servidor.
 * Guarda e retorna a respetiva subscrição.
 * @param uri 
 * @returns 
 */
export function initializeSignalWebsocket(uri: string): Subscription {
    //console.log('->initializingSignalWebsocket', { uri })

    const socket = webSocket<WebSocketMessage>(uri)
    setSignalWebsocket(socket)

    const sub = signalWebsocket.subscribe({
        next: (msg) => {
            //console.log(`received message on signal wss`)
            if (isSendWebSocketMessage(msg)) {
                processWebsocketMessage(msg).catch((e) => {
                    console.warn(`error accepting signal message`, { e })
                })
            } else if (isAcknowledgeMessage(msg)) {
                console.log(`- Acknowledge received`)
            } else {
                console.error('Message on wss is not recognized', { msg })
            }
        },
        error: (error) => {
            console.log('Error: ', error.message)                        
        },
        complete: () => {
            console.log(`- signal websocket complete`)
        },
    })

    setWebsocketSubscription(sub)
    return sub
}

/**
 * Função para processar uma mensagem recebida.
 * @param wsm 
 */
export async function processWebsocketMessage(wsm: SendWebSocketMessage): Promise<void> {
    console.log('-> processWebsocketMessage')
    const signalMessage = JSON.parse(wsm.message) as MessageType
    if (signalMessage.type === 1) {
        await processRegularMessage(wsm.from, signalMessage.body!, signalMessage.type)
    } else if (signalMessage.type === 3) {
        await processPreKeyMessage(wsm.from, signalMessage, signalMessage.type)
    }
}