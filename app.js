const express = require('express');
const socket = require('socket.io');
const fs = require('fs')

const app = express();
const server = app.listen(5000, () => {
    console.log('[Express] Server running')
});

app.use(express.static('client'));

// Websocket
const io = socket(server);

let owner = 'owner'
const userBase = []

logUser = (usr) => {
    console.log('---------- ---------- ----------')
    console.log(Date())
    console.log(usr + ' connected!')
    console.log('---------- ---------- ----------')
}

onConnection = (socket) => {
    console.log('Socket established: ' + socket.id)
    // Main Drawing Socket
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data)
        console.log(data)
        fs.writeFile('storage/' + owner.id + '.svg', data, (er)=> console.log(er));
    });

    // Username socket
    socket.on('register', (usr) => {
        logUser(usr)
        userBase.push(usr)
        console.log(userBase)
        owner = userBase[0]
        socket.broadcast.emit('usr', usr)
    })
    socket.on('disconnect', () => {
        // console.log(socket)
    });
}

io.on('connection', onConnection);
