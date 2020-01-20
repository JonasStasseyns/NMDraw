const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const tools = require('simple-svg-tools');
const detectSSid = require('detect-ssid');
const internalIp = require('internal-ip');

const app = express();
const server = app.listen(5000, () => {
    console.log('[Express] Server running')
});

let networkName;
let localIP = internalIp.v4.sync();

app.use(express.static('client'));

// Websocket
const io = socket(server);

let userBase = []

registerUserId = (name, id) => {
    userBase.push({name, id})
    console.log(userBase)
}

detectSSid((error, ssidname) => {
    networkName = ssidname
});

// Check on ownership system (in big test with monitor)
onConnection = (socket) => {
    console.log('Socket established: ' + socket.id)
    socket.emit('network', networkName, localIP)

    // Main Drawing Socket
    socket.on('drawing', (data) => {
        const svgArray = []
        userBase.forEach(user => {
            if(user.id === socket.id) fs.writeFile('storage/' + user.name + '.svg', data, (er) => console.log(er))
            tools.ImportSVG(`storage/${user.name}.svg`).then(svg => {
                svgArray.push(svg.toString())
            }).catch(err => console.log(err))
        })
        setTimeout(() => {
            socket.broadcast.emit('updateMonitor', svgArray)
        }, 1000)


        // console.log(data)
        console.log('Drawing data received')

        // Complete Drawing to earliest player
        // userBase[0].name ? fs.writeFile('storage/' + userBase[0].name + '.svg', data, (er) => console.log(er)) : console.log('No username was linked to this socket-id: ' + socket.id)


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

    // Send emoji list
    socket.on('showEmojiList', () => {
        console.log('-----')
        const emojiList = []
        //DEP
        fs.readdir('client/shapes', (err, files) => {
            files = files.filter((value, index, arr) => {
                return value !== '.DS_Store';
            });
            console.log('DONEEEE')
            console.log(files)
            socket.emit('sendList', files)
        })
        //DEP
        // tools.ImportDir('client/shapes').then(collection => {
        //     collection.forEach(svg => {
        //         emojiList.push(svg.toString())
        //     })
        //     console.log(emojiList)
        //     socket.emit('sendList', emojiList)
        // }).catch(err => {
        //     console.log(err);
        // });
    })

    socket.on('loadSpecificEmoji', (emoji) => {
        console.log('// LOAD SPECIFIC EMOJI //')
        console.log('- Selected emoji file name: ' + emoji)
        tools.ImportSVG('client/shapes/'+emoji).then(svg => {
            socket.emit('sendLoadedEmoji', svg.toString())
        }).catch(err => {
            console.log(err);
        });
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
