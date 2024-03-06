const fs = require('fs');
const express = require("express");
const app = express();
const PORT = 443;
const cors = require("cors");
const url = "https://192.168.1.68:443"
const https = false

const options = {
    key: fs.readFileSync('./certificates/file.pem'),
    cert: fs.readFileSync('./certificates/file.crt')
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

const http = https ? require("https").Server(options, app) : require("http").Server(app)

const socketIO = require('socket.io')(http, { cors: { origin: `<${url}>`, }});

//👇🏻 Generates random string as the ID
const generateID = () => Math.random().toString(36).substring(2, 10);

let firstSocket = null

//👇🏻 Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
      socket.disconnect()
      console.log('🔥: A user disconnected');
    });
});

socketIO.on('connect_error', (err) => {
    console.log("error: "+ err);
})

let chatRooms = []

socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    firstSocket = socket
    socket.on("createRoom", (roomName) => {
        socket.join(roomName);
        //👇🏻 Adds the new group name to the chat rooms array
        chatRooms.unshift({ id: generateID(), roomName, messages: [] });
        //👇🏻 Returns the updated chat rooms via another event
        socket.emit("roomsList", chatRooms);
    });

    socket.on("clientMessage", message => {
        console.log(message)
        socket.emit("serverMessage", "ehehehe");
    })

    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("🔥: A user disconnected");
    });
});

socketIO.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

app.get("/api", (req, res) => {
    res.json(chatRooms);
    firstSocket.emit('message', "asdsad");
});

http.listen(PORT, () => {
    console.log(`Server listening ssson ${PORT}`);
});