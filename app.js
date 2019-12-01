const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(5000, () => {
    console.log('[Express] Server running')
});

app.use(express.static('client'));

// Websocket
const io = socket(server);

function onConnection(socket){
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

io.on('connection', onConnection);