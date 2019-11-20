const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(5000, () => {
    console.log('[Express] Server running')
});

app.use(express.static('client'));

// Websocket
const io = socket(server);

io.on('connection', (connection) => {
    console.log('New socket-connection established: ' +  connection.id)
});