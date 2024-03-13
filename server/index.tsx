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

app.use(express.urlencoded({ extended: true }));
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

app.put("/addBundle", (req, res) => {
    console.log("AddBundleCalled!")
    console.log(req.body.bundle)
    clientBundles.set(req.body.username, req.body.bundle)
})

app.get("/getBundle/:username", (req, res) => {
    console.log("GetBundleCalled!")
    const username = req.params.username;
    res.send(JSON.stringify(clientBundles.get(username)))
})

http.listen(PORT, () => {
    console.log ( ip.address() );
    console.log(`Server listening on ${PORT}`);
})