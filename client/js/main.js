const socket = io()

let userActive = false;
let screenOrientation = '';
let toggleDevOrientation = document.getElementById("toggleOrientation");

toggleOrientatonAlert = () => {
    screenOrientation = screen.orientation.type
    if (!userActive && screenOrientation === 'landscape-primary') {
        toggleDevOrientation.className = 'please-flip-to-portrait'
        toggleDevOrientation.style.display = 'flex';
    } else if (!userActive && screenOrientation === 'portrait-primary') {
        toggleDevOrientation.className = ''
        toggleDevOrientation.style.display = 'none';
    }

    if (userActive && screenOrientation === 'portrait-primary') {
        toggleDevOrientation.className = 'please-flip-to-landscape'
        toggleDevOrientation.style.display = 'flex';
    } else if (userActive && screenOrientation === 'landscape-primary') {
        toggleDevOrientation.className = ''
        toggleDevOrientation.style.display = 'none';
    }
}

window.addEventListener('orientationchange', toggleOrientatonAlert)

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
    document.querySelector('.brush-tool').style.backgroundImage = (isDrawing) ? 'url(../images/brushstroke-active.svg)' : 'url(../images/brushstroke.svg)'
    document.querySelector('.brush-tool').style.boxShadow = (isDrawing) ? '' : 'url(../images/brushstroke.svg)'
    canvas.isDrawingMode = (isDrawing) ? 1 : 0
    canvas.freeDrawingBrush.color = brushColor
        // canvas.freeDrawingBrush.width = document.querySelector('.brush-size').value
    canvas.renderAll()
}


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

changeActiveShapeColor = (color) => {
    canvas.getActiveObject().setColor(color)
    console.log('Color Set')
    canvas.renderAll()
}

// Color Picker
const parent = document.querySelector('.colorpicker-tool');
const picker = new Picker(parent);
picker.onChange = function(color) {
    isDrawing ? brushColor = color.rgbString : changeActiveShapeColor(color.rgbString)
};

handleClickTouch = () => {
    socket.emit('drawing', canvas.toSVG())
    console.log('§canvas-evt')
}

// Body click event to send changes to the server
document.querySelector('.trigger-area').addEventListener('click', handleClickTouch)
document.querySelector('.trigger-area').addEventListener('touchend', handleClickTouch)

loadDrawing = () => {
    console.log('LOADBTN')
    socket.emit('drawingRequest', document.querySelector('.login-input').value)
    toHomeScreen()
    userActive = true;
    toggleOrientatonAlert()
}

newDrawing = () => {
    canvas.clear()
    socket.emit('register', document.querySelector('.login-input').value)
    toHomeScreen()
    userActive = true;
    toggleOrientatonAlert()
}

socket.on('load', (loadedDrawing) => {
    console.log('SVG-Data received')
    canvas.clear()
    document.querySelector('.login-overlay').style.display = 'none'
    fabric.loadSVGFromString(loadedDrawing, (objects, options) => {
        // const obj = fabric.util.groupSVGElements(objects, options)
        // canvas.add(obj).renderAll()
        objects.forEach((obj, i) => {
            canvas.add(obj);
        });
    })
})

toHomeScreen = () => {
    console.log('Go to home screen');
    document.querySelector('.login-overlay').style.display = 'none'
}

toLoginScreen = () => {
    document.querySelector('.login-overlay').style.display = 'flex'
    userActive = false
    toggleOrientatonAlert()
}

// Triggers validateUsername after each keystroke to check is the user has an existing drawing
document.querySelector('.login-input').addEventListener('input', validateUsername)

document.querySelector('.load-btn').addEventListener('click', loadDrawing)
document.querySelector('.new-btn').addEventListener('click', newDrawing)
    // document.querySelector('.login-btn').addEventListener('click', toHomeScreen)
document.querySelector('.logout-btn').addEventListener('click', toLoginScreen)


toggleOrientatonAlert()
