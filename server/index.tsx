// server.js
var admin = require("firebase-admin");

var serviceAccount = require("./admin/privatekey.json");

const appFirebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const { Subject } = require('rxjs')
const webSocket = require('ws')
const express = require("express")
const fs = require("fs")
const app = express()
const PORT = 443;
const cors = require("cors")
const https = false

const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

let ip = require("ip")

// Create a WebSocket server instance
const wss = new webSocket.Server({ port: 442 })
app.set("wss", wss)

const options = {
    key: fs.readFileSync('./certificates/server.key'),
    cert: fs.readFileSync('./certificates/server.crt')
};

const http = https ? require("https").Server(options, app) : require("http").Server(app)

//Map to store the client sockets, the key is the username and the value is the socket
const clientSockets = new Map()
//Map to store the client sockets, the key is the socket and the value is the username
const clientSocketsInverse = new Map()

//Map to store the client bundles, the key is the username and the value is the bundle
const clientBundles = new Map()

//Map to store the client types, the key is the username and the value is the type
//*Its important to dont allow a caregiver send a request to a caregiver or a elderly to a elderly
const clientType = new Map()

//Map to store the last update of the bundle, the key is the username and the value is the timestamp
const clientLastBundleUpdate = new Map()
//Map to store the public key of the client, the key is the username and the value is the public key
const clientPublicKey = new Map()
//Map to store the last update of the publicKey, the key is the username and the value is the timestamp
const clientLastPKUpdate = new Map()
//Map to store the messages that are waiting to be sent, the key is the username and the value is the list of messages
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

app.put("/updatePublicKey", (req, res) => {
    console.log("==> UpdatePublicKey")
    try {
        const bundleWithPublicKey = Uint8Array.from(tweetnaclUtil.decodeBase64(req.body.bundleWithPublicKey))
        let oldPublicKey = clientPublicKey.get(req.body.username)
        const verifiedNewPublicKey = tweetnacl.sign.open(bundleWithPublicKey, oldPublicKey)

        //let newPublicKey = Uint8Array.from(tweetnaclUtil.decodeBase64(req.body.newPublicKey)) 
        //const publicKey = tweetnacl.sign.open(newPublicKey, oldPublicKey)
        if (verifiedNewPublicKey === null) {
            console.log('Key could not be verified')
            return
        } 
        
        const verified = tweetnaclUtil.encodeUTF8(verifiedNewPublicKey)
        const publicKeyObj = JSON.parse(verified.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, ''))

        //Verifico se o username do bundle é igual ao username da requisição
        console.log(publicKeyObj.username)
        console.log(req.body.username)
        if(publicKeyObj.username !== req.body.username) {
            console.log('Username does not match')
            return
        }

        //Verifico se o timestamp do bundle é maior que o timestamp do último bundle
        if(publicKeyObj.timestamp <= clientLastPKUpdate.get(req.body.username)) {
            console.error('BundleKey is outdated')
            return
        } else {
            clientLastPKUpdate.set(req.body.username, publicKeyObj.timestamp)
        }
        console.log("Public key updated sucessfully")

        clientPublicKey.set(req.body.username, Uint8Array.from(tweetnaclUtil.decodeBase64(publicKeyObj.publicKey)))
    } catch (error) {
        console.log(error)
        return
    }
})

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
        const bundle = Uint8Array.from(tweetnaclUtil.decodeBase64(req.body.bundleSigned))
        //Se ainda não possuir a chave privada do utilizador, vamos armazenar no servidor
        if (!clientPublicKey.has(req.body.username)) {
            clientPublicKey.set(req.body.username, publicKey)
            console.log('=> Public key added successfully')
        } else {
            publicKey = clientPublicKey.get(req.body.username)
        }
        const verifiedBundle = tweetnacl.sign.open(bundle, publicKey)
        //Verifico se a mensagem foi assinada com a devida chave privada
        if (verifiedBundle === null) {
            console.log('Message could not be verified')
            return
        }
        const verified = tweetnaclUtil.encodeUTF8(verifiedBundle)
        const bundleObj = JSON.parse(verified.replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, ''))

        //Verifico se o username do bundle é igual ao username da requisição
        console.log(bundleObj.username)
        console.log(req.body.username)
        if(bundleObj.username !== req.body.username) {
            console.log('Username does not match')
            return
        }

        //Verifico se o timestamp do bundle é maior que o timestamp do último bundle
        if(bundleObj.timestamp <= clientLastBundleUpdate.get(req.body.username)) {
            console.error('Bundle is outdated')
            return
        } else {
            clientLastBundleUpdate.set(req.body.username, bundleObj.timestamp)
        }

        clientType.set(req.body.username, bundleObj.userType)
        clientBundles.set(req.body.username, JSON.stringify(bundleObj.bundle))
        console.log('=> Bundle added successfully')
    } catch (error) {
        console.log("Erro", error)
        return
    }
})

/**
 * Get a bundle from the server
 * @param username - The username of the user
 * @returns void
 */
app.get("/getCaregiverBundle/:username", (req, res) => {
    console.log("==> getCaregiverBundleCalled")
    try {
        if(clientType.get(req.params.username) === 'caregiver') {
            const bundle = JSON.parse(clientBundles.get(req.params.username))
            res.send(bundle)
        } else {
            res.send(null)
        }
    } catch (error) {
        res.send(null)
    }
})

app.get("/getElderlyBundle/:username", (req, res) => {
    console.log("==> getElderlyBundleCalled")
    try {
        if(clientType.get(req.params.username) === 'elderly') {
            const bundle = JSON.parse(clientBundles.get(req.params.username))
            res.send(bundle)
        } else {
            res.send(null)
        }
    } catch (error) {
        res.send(null)
    }
})


http.listen({port: PORT}, async () => {
    console.log (ip.address())
    db.collection("Server").doc("server").set({ip: `${https ? 'https://' : 'http://'}${ip.address()}`})
    

    /*
    db.collection("Elderly").doc("qf3pF9rKc1Wdq6G1vYrWOPxGHa33").collection("Credencials").get().then((docs) => {
        docs.forEach((doc) => { 
            if(doc.data()) {
                console.log(doc.data().data)
            }
        });
    })

    db.collection("Elderly").doc("9ap7Vg3pZbcBTAnt1KTaTh4oDfC3").collection("Credencials").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.update({
                data: '1111'
            });
        });
    });
*/
    console.log(`Server listening on ${PORT}`);
})