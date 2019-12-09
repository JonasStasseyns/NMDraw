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
        // console.log(data)
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
            console.log('--- VALIDATION SVG FILES END ---')
        })
    })

    // Username socket
    socket.on('login', (usr) => {
        fs.readdir('storage', (err, files) => {
            console.log('--- SVG FILES START ---')
            files.forEach((file) => {
                console.log(file)
                if(file.split('.')[0] === usr.name){
                    tools.ImportSVG('storage/'+file).then(svg => {
                        // SVG was imported
                        // Variable 'svg' is instance of SVG class
                        console.log('--- LOADED SVG START ---');
                        console.log(svg.toString());
                        console.log('--- LOADED SVG END ---');
                        socket.broadcast.emit('load', svg.toString())
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
            console.log('--- SVG FILES END ---')
        })
        logUser(usr)
        userBase.push(usr)
        console.log(userBase)
        owner = userBase[0].name
        console.log('ub0name: ' + userBase[0].name)
        socket.broadcast.emit('usr', usr.name)
    })
    socket.on('disconnect', () => {
        // console.log(socket)
    });
}

io.on('connection', onConnection);
