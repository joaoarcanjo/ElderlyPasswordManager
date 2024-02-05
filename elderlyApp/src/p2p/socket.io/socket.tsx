const io = require('socket.io-client')
const https = false
const url = 'http://192.168.1.68:443'

const socket = io(url, { rejectUnauthorized: false })

socket.on('connect', () => {
  console.log('Connected to server')
  socket.emit('clientMessage', 'Hello from the client!')
});

socket.on('serverMessage', (message: string) => {
  console.log('Message from server:', message)
});

socket.on('disconnect', () => {
  console.log('Disconnected from server')
});

socket.on('connect_error', (error: any) => {
  console.log("Error message: " + error.message)
  console.log(error.description)
});

socket.on('connect_failed', function() {
  console.log('Connection Failed')
});

export function sendMessage(message: string) {
  socket.emit('message', message)
}

export function startSocket() { 
  socket.connect()
    console.log("ola")
}