const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const tools = require('simple-svg-tools');

const app = express();
const server = app.listen(5000, () => {
    console.log('[Express] Server running')
});

app.use(express.static('client'));

// Websocket
const io = socket(server);

let owner = 'owner'
let userBase = []

logUser = (usr) => {
    console.log('---------- ---------- ----------')
    console.log(Date())
    console.log(usr + ' connected!')
    console.log('---------- ---------- ----------')
}

registerUserId = (name, id) => {
    console.log('registerUserID()')
    userBase.push({
        name,
        id
    })
    console.log(userBase)
    console.log(name)
    console.log(id)
    console.log('---')
}

// TODO Registration (manage ownership) disconnect id
onConnection = (socket) => {
    console.log('Socket established: ' + socket.id)

    // Main Drawing Socket
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data)
        console.log(data)
        fs.writeFile('storage/' + owner + '.svg', data, (er)=> console.log(er));
    });

    // Validation socket
    socket.on('validation', (value) => {
        console.log(value.value)
        fs.readdir('storage', (err, files) => {
            files.forEach((file) => {
                if(file.split('.')[0] === value.value && file.split('.')[0] !== ''){
                    console.log('match')
                    console.log(value.id)
                    socket.emit('validationResponse', true);
                }
            })
        })
    })

    // Request Drawing Load
    socket.on('drawingRequest', (name) => {
        registerUserId(name, socket.id)
        tools.ImportSVG(`storage/${name}.svg`).then(svg => {
            console.log('--- LOADED SVG START ---');
            console.log(svg.toString());
            console.log('--- LOADED SVG END ---');
            socket.emit('load', svg.toString())
        }).catch(err => {
            console.log(err);
        });
    })

    // Username socket
    socket.on('register', (usr) => {

        logUser(usr)
        userBase.push(usr)
        console.log(userBase)
        owner = userBase[0].name
        console.log('ub0name: ' + userBase[0].name)
        socket.broadcast.emit('usr', usr.name)
    })
    socket.on('disconnect', () => {
        console.log(userBase)
        userBase = userBase.filter(function( obj ) {
            return obj.id !== socket.id;
        });
        console.log('')
        console.log(userBase)
        console.log('Socket closed: ' + socket.id)
    });
}

io.on('connection', onConnection);
