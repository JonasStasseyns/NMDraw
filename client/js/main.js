const socket = io()

let userActive = false;

// force user to flip device
let screenOrientation = '';
let toggleDevOrientation = document.getElementById("toggleOrientation");

toggleOrientatonAlert = () => {
    // console.log(window.orientation)
    screenOrientation = window.orientation.toString()
    if ((!userActive && screenOrientation == '-90') || (!userActive && screenOrientation == '90')) {
        window.scrollTo(0, 0)
        toggleDevOrientation.className = 'please-flip-to-portrait'
        toggleDevOrientation.style.display = 'flex';
    } else if (!userActive && screenOrientation === 'portrait-primary' || (window.orientation == 0)) {
        window.scrollTo(0, 0)
        toggleDevOrientation.className = ''
        toggleDevOrientation.style.display = 'none';
    }

    if (userActive && screenOrientation === '0') {
        toggleDevOrientation.className = 'please-flip-to-landscape'
        toggleDevOrientation.style.display = 'flex';
    } else if (userActive != '0') {
        toggleDevOrientation.className = ''
        toggleDevOrientation.style.display = 'none';
    }
}

window.addEventListener('orientationchange', toggleOrientatonAlert)


// toggle tool background color when active
toggleToolState = (element) => {
    element.preventDefault();
    element.target.classList.toggle('tool-wrapper-active');
}

unToggleToolState = () => {
    toolContainers[2].classList.remove("tool-wrapper-active")
}

let toolContainers = document.querySelectorAll('.tool-wrapper');
toolContainers.forEach(e => {
    e.addEventListener('click', toggleToolState);
});


validateUsername = (e) => {
    document.querySelector('.load-btn').style.display = 'none'
    // console.log(e.target.value)
    // console.log(socket.id)
    socket.emit('validation', {
        value: e.target.value,
        id: socket.id
    })
}

socket.on('validationResponse', (val) => {
    // console.log(val)
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

// Canvas Init
const canvas = window._canvas = new fabric.Canvas('c')
canvas.setWidth(window.innerWidth)
canvas.setHeight(window.innerHeight)

// Remove active shape
document.querySelector('.remove-tool').addEventListener('click', (e) => {
    canvas.remove(canvas.getActiveObject())
})
let brushColor = 'black';

// free draw with brushtool
toggleDraw = () => {
    isDrawing = !isDrawing
    // console.log(isDrawing)
    canvas.isDrawingMode = (isDrawing) ? 1 : 0
    canvas.freeDrawingBrush.color = brushColor
    canvas.freeDrawingBrush.width = document.querySelector('.brush-size').value
    canvas.renderAll()
}

document.querySelector('.free-draw-toggle-icon').addEventListener('click', toggleDraw)

// Create shape based on the selected shape and size
createShape = (e) => {
    let shape;
    const centerX = window.innerWidth/2
    const centerY = window.innerHeight/2
    switch (e.target.id) {
        case 'circleShape':
            shape = new fabric.Circle({
                radius: 20,
                fill: '#0B61A4',
                top: centerY,
                left: centerX,
            })
            break
        case 'triangleShape':
            shape = new fabric.Triangle({
                width: 40,
                height: 40,
                fill: '#0B61A4',
                top: centerY,
                left: centerX,
            })
            break
        case 'rectShape':
            shape = new fabric.Rect({
                width: 40,
                height: 40,
                fill: '#0B61A4',
                top: centerY,
                left: centerX,
            })
            break
    }
    canvas.add(shape)
}

showHideShapes = () => {
    let shapeTools = document.getElementById('shapeTools')
    shapeTools.style.display === "flex" ?
        shapeTools.style.display = "none" :
        shapeTools.style.display = "flex"
    document.querySelector('#shapeSelector').classList.add('shapetools-active')
}


// Event Listeners
const shapeIcons = document.querySelectorAll('.shape-icon')
// TODO Add shape selector evtlistener + shape select store
document.querySelector('#shapeSelector').addEventListener('click', showHideShapes)

shapeIcons.forEach((icon) => {
    icon.addEventListener('click', createShape)
})

changeActiveShapeColor = (color) => {
    if (canvas.getActiveObject() && canvas.getActiveObject().get('type') !== 'path') {
        canvas.getActiveObject().setColor(color)
    }
    console.log('Color Set')
    canvas.renderAll()
}

// Color Picker
const parent = document.querySelector('.activate-colorpicker-tool');
const picker = new Picker(parent);
picker.onChange = (color) => {
    isDrawing ? canvas.freeDrawingBrush.color = color.rgbString : changeActiveShapeColor(color.rgbString)
}
picker.onDone = () => {
    window.scrollTo(0, 0)
    console.log('Submit was clicked')
    unToggleToolState()
}
picker.onClose = () => {
    window.scrollTo(0, 0)
    unToggleToolState()
}


handleClickTouch = () => {
    setTimeout(() => {
        socket.emit('drawing', canvas.toSVG())
        console.log(canvas.toSVG())
    }, 10)
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

newDrawing = () => { // Link username to socket-ID
    canvas.clear()
    socket.emit('register', document.querySelector('.login-input').value)
    toHomeScreen()
    userActive = true;
    toggleOrientatonAlert()
}

socket.on('load', (loadedDrawing) => { // Load drawing from username.svg
    // console.log('SVG-Data received')
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
document.querySelector('.logout-btn').addEventListener('click', toLoginScreen)

toggleOrientatonAlert()



// Feature undo and redo recent actions on canvas
let undo = []
let redo = []
let alterCanvasState = false;

stackCanvasChanges = () => {
    if (!alterCanvasState) {
        undo.push(JSON.stringify(canvas));
        redo = [];
        // console.log('Changes detected on canvas', undo);
    }
}

undoAction = (e) => {
    alterCanvasState = true;
    redo.push(undo.pop());
    let prevState = undo[undo.length - 1];
    if (prevState == null) {
        prevState = '{}';
    }
    canvas.loadFromJSON(prevState, function () {
        canvas.renderAll();
    })
    alterCanvasState = false;
}

redoAction = (e) => {
    alterCanvasState = true;
    state = redo.pop();
    if (state != null) {
        undo.push(state);
        canvas.loadFromJSON(state, function () {
            canvas.renderAll();
        })
        alterCanvasState = false;
    }
}

showEmojiList = () => {
    socket.emit('showEmojiList', true)
}

// Receiving list of emoji thumbnails
socket.on('sendList', (list) => {
    document.querySelector('.emoji-list-container').innerHTML = ''
    document.querySelector('.emoji-list-container').style.display = 'flex'
    list.forEach(emoji => {
        console.log(emoji)
        const div = document.createElement('div')
        div.classList.add('emoji-div')
        div.style.backgroundImage = 'url("../shapes/' + emoji + '")'
        div.id = emoji
        div.addEventListener('click', e => socket.emit('loadSpecificEmoji', emoji))
        document.querySelector('.emoji-list-container').appendChild(div)
    })
})

socket.on('sendLoadedEmoji', (svg) => {
    fabric.loadSVGFromString(svg, (objects, options) => {
        objects.forEach((obj, i) => {
            canvas.add(obj);
        });
    })
    canvas.renderAll()
    document.querySelector('.emoji-list-container').style.display = 'none'
})

canvas.on('object:removed', stackCanvasChanges);
canvas.on('object:modified', stackCanvasChanges);
canvas.on('object:added', stackCanvasChanges);

let undoButton = document.querySelector('.undo-button').addEventListener('click', undoAction)
let redoButton = document.querySelector('.redo-button').addEventListener('click', redoAction)
let emojiBtn = document.querySelector('.spawn-emoji').addEventListener('click', showEmojiList)
