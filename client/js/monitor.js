const socket = io()

const body = document.querySelector('body')
const canvas = window._canvas = new fabric.Canvas('c')
canvas.setWidth(window.innerWidth)
canvas.setHeight(window.innerHeight)

let init = true

socket.on('king', (userObject) => {
    console.log(userObject)
})

// socket.on('network', (ssid) => {
//     console.log(ssid)
// })

socket.on('updateMonitor', (data) => {
    if(!init){
        canvas.clear()
    }
    // console.log(data)
    fabric.loadSVGFromString(data, function(objects, options) {
        const obj = fabric.util.groupSVGElements(objects, options)
        canvas.add(obj).renderAll()
    })
    init = false
})


// socket.on('load', (data) => {
//     if(!init){
//         canvas.clear()
//     }
//     console.log('LOAD')
//     console.log(data)
//     fabric.loadSVGFromString(data, function(objects, options) {
//         const obj = fabric.util.groupSVGElements(objects, options)
//         canvas.add(obj).renderAll()
//     })
//     init = false
// })

socket.on('usr', (usr) => {
    const disp = document.createElement('div')
    disp.classList.add('user-toast')
    disp.innerHTML = usr + ' Connected!'
    document.querySelector('.toast-container').appendChild(disp)
    console.log(usr + 'Connected!')
})

loadCanvas = (data) => {
    fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: 'rgba(102,153,255,0.5)',
        cornerSize: 12,
        padding: 5
    })
}
