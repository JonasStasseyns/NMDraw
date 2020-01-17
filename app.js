const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const tools = require('simple-svg-tools');
const detectSSid = require('detect-ssid');

const app = express();
const server = app.listen(5000, () => {
    console.log('[Express] Server running')
});

app.use(express.static('client'));

// Websocket
const io = socket(server);

let userBase = []

registerUserId = (name, id) => {
    userBase.push({name, id})
    console.log(userBase)
}

// detectSSid((error, ssidname) => {
//     socket.emit('network', ssidname)
// })

// Check on ownership system (in big test with monitor)
onConnection = (socket) => {

    console.log('Socket established: ' + socket.id)

    // Main Drawing Socket
    socket.on('drawing', (data) => {
        socket.broadcast.emit('updateMonitor', data)
        // console.log(data)
        console.log('Drawing data received')
        userBase[0].name ? fs.writeFile('storage/' + userBase[0].name + '.svg', data, (er) => console.log(er)) : console.log('No username was linked to this socket-id: ' + socket.id)
    });

    // Validation socket
    socket.on('validation', (value) => {
        fs.readdir('storage', (err, files) => {
            files.forEach((file) => {
                if (file.split('.')[0] === value.value && file.split('.')[0] !== '') {
                    socket.emit('validationResponse', true)
                }
            })
        })
    })

    // Request Drawing Load
    socket.on('drawingRequest', (name) => {
        registerUserId(name, socket.id)
        tools.ImportSVG(`storage/${name}.svg`).then(svg => socket.emit('load', svg.toString())).catch(err => console.log(err))
    })

    // Username socket
    socket.on('register', (name) => {
        registerUserId(name, socket.id)
        socket.broadcast.emit('king', userBase[0])
        socket.broadcast.emit('usr', name)
    })

    // Socket triggers on disconnect and removes user from userBase[]
    socket.on('disconnect', () => {
        console.log(userBase)
        userBase = userBase.filter((obj) => {
            return obj.id !== socket.id;
        });
        console.log(userBase)
        console.log('Socket closed: ' + socket.id)
    });
}

io.on('connection', onConnection);
