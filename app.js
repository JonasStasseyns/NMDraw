const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(5000, () => {
    console.log('[Express] Server running')
});

app.use(express.static('client'));

// Websocket
const io = socket(server);

const userList = []

logUser = (usr) => {
    console.log('---------- ---------- ----------')
    console.log(Date())
    console.log(usr + ' connected!')
    console.log('---------- ---------- ----------')
}

onConnection = (socket) => {
    console.log('Socket established: ' + socket.id)
    // Main Drawing Socket
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
    // Username socket
    socket.on('usr', (usr) => {
        logUser(usr)
        socket.broadcast.emit('usr', usr)
    })
    socket.on('disconnect', () => {
        console.log(socket)
    });
}

io.on('connection', onConnection);
