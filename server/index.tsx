// server.js
const { Subject } = require('rxjs')
const webSocket = require('ws')
const express = require("express")
const fs = require("fs")
const app = express()
const PORT = 443;
const cors = require("cors")
const url = "http://192.168.1.68:443"
const https = false

const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

let ip = require("ip");

// Create a WebSocket server instance
const wss = new webSocket.Server({ port: 442 })

const options = {
    key: fs.readFileSync('./certificates/file.pem'),
    cert: fs.readFileSync('./certificates/file.crt')
};


const http = https ? require("https").Server(options, app) : require("http").Server(app)

const clientSockets = new Map()
const clientSocketsInverse = new Map()

const clientBundles = new Map()
const clientLastBundleUpdate = new Map()
const clientPublicKey = new Map()

const clientMessagesWaiting = new Map()


// Handle WebSocket connections
wss.on('connection', function connection(ws) {

    // When the client sends a message, publish it to the subject
    ws.on('message', async function incoming(message) {
    
        const messageObj = JSON.parse(message)
        const userAction = messageObj.action
        
        switch(userAction) {
            case('subscribe'): {
                console.log('Client subscribed!')
                console.log('- Username: ', messageObj.username)
                clientSockets.set(messageObj.username, ws)
                clientSocketsInverse.set(ws, messageObj.username)

                const list = clientMessagesWaiting.get(messageObj.username)
                if(list) {
                    for(let message of list) {
                        ws.send(JSON.stringify(message))
                    }
                    clientMessagesWaiting.delete(messageObj.username)
                }
                break;
            }
            case('sendMessage'): {
                console.log(`Client ${messageObj.from} sent a message!`)
                const to = messageObj.address
                
                const socket = clientSockets.get(to)

                if(!socket) {
                    const list = clientMessagesWaiting.get(to)
                    if(!list) {
                        clientMessagesWaiting.set(to, [messageObj])
                    } else {
                        list.push(messageObj)
                    }
                    console.log('=> Message added to waiting list for ', to)

                } else {
                    console.log('=> Message sent to ', to)
                    socket.send(JSON.stringify(messageObj))
                }

                break;
            }
            case('acknowledge'): {
                console.log(`Client ${messageObj.from} sent an acknowledgement!`)
                const to = messageObj.address

                const socket = clientSockets.get(to)

                if(!socket) {
                    const list = clientMessagesWaiting.get(to)
                    if(!list) {
                        clientMessagesWaiting.set(to, [messageObj])
                    } else {
                        list.push(messageObj)
                    }
                    console.log('=> Message added to waiting list for ', to)

                } else {
                    console.log('=> Message sent to ', to)
                    socket.send(JSON.stringify(messageObj))
                }
                break;
            }
        }
    });

    // When the client disconnects, unsubscribe from the subject
    ws.on('close', function close() {
        console.log('Client disconnected')
        const username = clientSocketsInverse.get(ws)
        
        clientSocketsInverse.delete(ws)
        clientSockets.delete(username)
        //clientBundles.delete(username)
    })
})

app.get("/isAlive", (req, res) => {
    res.send("Hello World!")
});

app.get("/getBundles", (req, res) => {
    console.log("GetBundlesCalled!")
    let identities = ""
    clientBundles.forEach((value, key) => {
        identities += key + ", " + JSON + ",\n "
    })
    res.send("<html><body><h1>Bundles: " + identities + "</h1></body></html>")
});

app.get("/getSockets", (req, res) => {
    let identities = ""
    clientSockets.forEach((value, key) => {
        identities += key + ", "
    })
    res.send("<html><body><h1>Sockets: " + identities + "</h1></body></html>")
});

/**
 * Add a bundle to the server
 * @param publicKey - The public key of the user
 * @param bundle - The bundle of the user
 * @param username - The username of the user
 * @returns void
 */
app.put("/addBundle", (req, res) => {
    console.log("==> AddBundleCalled")
    try {
        let publicKey = Uint8Array.from(tweetnaclUtil.decodeBase64(req.body.publicKey)) 
        const bundle = Uint8Array.from(tweetnaclUtil.decodeBase64(req.body.bundle))
        
        //Se ainda não possuir a chave privada do utilizador, vamos armazenar no servidor
        if (!clientPublicKey.has(req.body.username)) {
            clientPublicKey.set(req.body.username, publicKey)
            console.log('=> Public key added successfully')
        } else {
            publicKey = clientPublicKey.get(req.body.username)
        }

        const verified = verifyMessage(bundle, publicKey)
        //Verifico se a mensagem foi assinada com a devida chave privada
        if (verified === null) {
            console.error('Message could not be verified')
            return
        }
        const verifiedString = tweetnaclUtil.encodeUTF8(verified)
        const obj = JSON.parse(verifiedString.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, ''))

        //Verifico se o username do bundle é igual ao username da requisição
        if(obj.username !== req.body.username) {
            console.error('Username does not match')
            return
        }

        //Verifico se o timestamp do bundle é maior que o timestamp do último bundle
        if(obj.timestamp <= clientLastBundleUpdate.get(req.body.username)) {
            console.error('Bundle is outdated')
            return
        } else {
            clientLastBundleUpdate.set(req.body.username, obj.timestamp)
        }

        clientBundles.set(req.body.username, JSON.stringify(obj.bundle))
        console.log('=> Bundle added successfully')
    } catch (error) {
        console.log(error)
        return
    }
})

app.get("/getBundle/:username", (req, res) => {
    console.log("==> GetBundleCalled")
    try {
        const bundle = JSON.parse(clientBundles.get(req.params.username))
        res.send(bundle)
    } catch (error) {
        res.send(null)
    }
})

http.listen(PORT, () => {
    console.log ( ip.address());
    console.log(`Server listening on ${PORT}`);
})

function verifyMessage(signedMessage, publicKey) {
    return tweetnacl.sign.open(signedMessage, publicKey)
}