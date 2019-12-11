const socket = io()

validateUsername = (e) => {
    document.querySelector('.load-btn').style.display = 'none'
    console.log(e.target.value)
    console.log(socket.id)
    socket.emit('validation', { value: e.target.value, id: socket.id })
}

socket.on('validationResponse', (val) => {
    console.log(val)
    document.querySelector('.load-btn').style.display = 'block'
})

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(102,153,255,0.5)',
    cornerSize: 20,
    padding: 5
})

// Global variables
let isDrawing = false
let brushColor = 'black'

// Canvas Init
const canvas = window._canvas = new fabric.Canvas('c')
canvas.setWidth(window.innerWidth)
canvas.setHeight(window.innerHeight)

// Remove active shape
document.querySelector('.remove').addEventListener('click', (e) => {
    canvas.remove(canvas.getActiveObject())
})

// Drawing Test
toggleDraw = () => {
    // TODO Change ui button based on isDrawing
    isDrawing = !isDrawing
    console.log(isDrawing)
    document.querySelector('.free-draw-toggle-icon').style.color = (isDrawing) ? 'red' : 'black'
    canvas.isDrawingMode = (isDrawing) ? 1 : 0
    canvas.freeDrawingBrush.color = brushColor
        // canvas.freeDrawingBrush.width = document.querySelector('.brush-size').value
    canvas.renderAll()
}

// Create a start shape for debugging
// canvas.add(new fabric.Triangle({
//     width: 150,
//     height: 100,
//     left: 160,
//     top: 200,
//     fill: '#00AF64'
// }))

// Create shape based on the selected shape and size
createShape = (e) => {
    switch (e.target.id) {
        case 'circleShape':
            canvas.add(new fabric.Circle({
                radius: 20,
                left: Math.random() * 400 + 100,
                top: Math.random() * 400 + 100,
                fill: '#0B61A4'
            }))
            break
        case 'triangleShape':
            canvas.add(new fabric.Triangle({
                width: 40,
                height: 40,
                left: Math.random() * 400 + 100,
                top: Math.random() * 400 + 100,
                fill: '#0B61A4'
            }))
            break
        case 'rectShape':
            canvas.add(new fabric.Rect({
                width: 40,
                height: 40,
                left: Math.random() * 400 + 100,
                top: Math.random() * 400 + 100,
                fill: '#0B61A4'
            }))
            break
    }
}

showHideShapes = () => {
    let shapeTools = document.getElementById('shapeTools')
    shapeTools.style.display === "flex" ?
        shapeTools.style.display = "none" :
        shapeTools.style.display = "flex"
}


// Event Listeners
const shapeIcons = document.querySelectorAll('.shape-icon')
    // TODO Add shape selector evtlistener + shape select store
document.querySelector('.free-draw-toggle-icon').addEventListener('click', toggleDraw)
document.querySelector('#shapeSelector').addEventListener('click', showHideShapes)

shapeIcons.forEach((icon) => {
    icon.addEventListener('click', createShape)
})

// Color Picker
const parent = document.querySelector('.colorpicker-tool');
const picker = new Picker(parent);
picker.onChange = function(color) {
    brushColor = color.rgbString
};

// Body click event to send changes to the server
document.querySelector('body').addEventListener('click', () => {
    socket.emit('drawing', canvas.toSVG())
    console.log('bodyevt')
})

loadDrawing = () => {
    console.log('LOADBTN')
    socket.emit('drawingRequest', document.querySelector('.login-input').value)
}

socket.on('load', (loadedDrawing) => {
    console.log('loadddddd')
    document.querySelector('.login-overlay').style.display = 'none'
    fabric.loadSVGFromString(loadedDrawing, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options)
        canvas.add(obj).renderAll()
    })
})

toHomeScreen = () => {
    console.log('Go to home screen');
    document.querySelector('.login-overlay').style.display = 'none'
}

toLoginScreen = () => {
    document.querySelector('.login-overlay').style.display = 'flex'
}

document.querySelector('.login-input').addEventListener('input', validateUsername)
document.querySelector('.load-btn').addEventListener('click', loadDrawing)
document.querySelector('.login-btn').addEventListener('click', toHomeScreen)
document.querySelector('.logout-btn').addEventListener('click', toLoginScreen)
