const socket = io()

let userActive = false;
let isDrawing = false
const randomUsers = ['Goku', 'Gohan', 'Goten', 'Bulma', 'Krillin', 'Vegeta', 'Cell', 'Buu', 'Frieza', 'Piccolo', 'Broly', 'Beerus', 'Whis']

// force user to flip device
let screenOrientation = '';
let toggleDevOrientation = document.getElementById("toggleOrientation");

toggleOrientatonAlert = () => {
    setTimeout(() => {
        canvas.setWidth(window.innerWidth)
        canvas.setHeight(window.innerHeight)
    }, 500)
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
toggleToolState = (e) => {
    e.preventDefault();
    e.target.classList.toggle('tool-wrapper-active');
}

let toolContainers = document.querySelectorAll('.tool-wrapper');

resetAllTools = (fromCP) => {
    toolContainers.forEach(e => {
        if (!isDrawing && e.classList.contains('free-draw-toggle-icon')) e.classList.remove("tool-wrapper-active")
    });
    if (!fromCP) isDrawing = false
}

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


// Canvas Init
const canvas = window._canvas = new fabric.Canvas('c')
canvas.setWidth(window.innerWidth)
canvas.setHeight(window.innerHeight)

// remove one or multiple objects
deleteAllSelectedObjects = () => {
    canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object)
    })
    canvas.renderAll();
}
document.querySelector('.remove-tool').addEventListener('click', deleteAllSelectedObjects)


// Switch initial brush color to black or white according to users theme mode
let brushColor
initializeBrushColor = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // No absolute white because monitor canvas will be rgb(250, 250, 250)
        if (canvas.freeDrawingBrush.color === 'rgb(0, 0, 0)') canvas.freeDrawingBrush.color = 'rgb(140,255,211)'
    }
    // else {
    //     canvas.freeDrawingBrush.color == 'rgb(0, 0, 0)'
    // }
}
setInterval(() => {
    initializeBrushColor()
}, 2000);

// Toggle brush slider, increase or decrease brush width
let brushToolSize = document.querySelector('.brush-size-tools')
toggleBrushSlider = () => {
    console.log('toggleBrush')
    document.querySelector('#shapeSelector').classList.remove('tool-wrapper-active')
    document.querySelector('.shapetools').style.display = 'none'
    brushToolSize.style.display === "flex" ?
        brushToolSize.style.display = "none" :
        brushToolSize.style.display = "flex"
    isDrawing = !isDrawing
    canvas.isDrawingMode = (isDrawing) ? 1 : 0
}
document.querySelector('.free-draw-toggle-icon').addEventListener('click', toggleBrushSlider)

// Update brush width
let slider = document.querySelector('.slider')
let output = document.querySelector('.brush-value').textContent = slider.value
updateBrushValue = () => {
    let sliderValue = document.querySelector('.slider').value
    output = document.querySelector('.brush-value').textContent = sliderValue
    canvas.isDrawingMode = 1
    canvas.freeDrawingBrush.width = parseInt(sliderValue)
}
slider.addEventListener('change', updateBrushValue)

// Close brush width slider
closeSlider = () => {
    canvas.isDrawingMode = 0
    brushToolSize.style.display = "none"
    resetAllTools()
}
document.querySelector('.close-slider').addEventListener('click', closeSlider)

// Create shape based on the selected shape and size
createShape = (e) => {
    let shape;
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
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
    isDrawing = false
    canvas.isDrawingMode = 0
    document.querySelector('.free-draw-toggle-icon').classList.remove('tool-wrapper-active')
    document.querySelector('.brush-size-tools').style.display = 'none'
    let shapeTools = document.getElementById('shapeTools')
    shapeTools.style.display === "flex" ?
        shapeTools.style.display = "none" :
        shapeTools.style.display = "flex"
    document.querySelector('#shapeSelector').classList.add('shapetools-active')
}

// Event Listeners
const shapeIcons = document.querySelectorAll('.shape-icon')
document.querySelector('#shapeSelector').addEventListener('click', showHideShapes)

shapeIcons.forEach((icon) => {
    icon.addEventListener('click', createShape)
})

changeActiveShapeColor = (color) => {
    if (canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'path') {
        canvas.getActiveObject().set({
            stroke: color
        });
        console.log('Path was selected')
    } else if (canvas.getActiveObject()) {
        console.log(canvas.getActiveObject())
        // canvas.getActiveObject().setColor(color)
        // canvas.getActiveObject().setStroke(color);
        // (canvas.getActiveObject() && canvas.getActiveObject().get('type') !== 'path')
        console.log('Object was selected')
    }
    canvas.renderAll()
}

// Color Picker
const parent = document.querySelector('.activate-colorpicker-tool');
const picker = new Picker(parent);
picker.onChange = (color) => {
    isDrawing ? canvas.freeDrawingBrush.color = color.rgbString : changeActiveShapeColor(color.rgbString)
    // isDrawing ? console.log('BRUSH: ' + color.rgbString) : console.log('SHAPE')
}
picker.onDone = () => {
    window.scrollTo(0, 0)
    resetAllTools(true)
}
picker.onClose = () => {
    window.scrollTo(0, 0)
    resetAllTools(true)
}


handleClickTouch = () => {
    setTimeout(() => {
        socket.emit('drawing', canvas.toSVG())
    }, 10)
}

// Body click event to send changes to the server
document.querySelector('.trigger-area').addEventListener('click', handleClickTouch)
document.querySelector('.trigger-area').addEventListener('touchend', handleClickTouch)

loadDrawing = () => {
    // console.log('LOADBTN')
    socket.emit('drawingRequest', document.querySelector('.login-input').value)
    toHomeScreen()
    userActive = true;
    toggleOrientatonAlert()
}

newDrawing = () => { // Link username to socket-ID
    canvas.clear()
    if (document.querySelector('.login-input').value !== '') {
        socket.emit('register', document.querySelector('.login-input').value)
    } else {
        const i = Math.floor(Math.random() * randomUsers.length)
        socket.emit('register', randomUsers[i])
    }
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

// Function that checks whether or not the container is empty
// And if so, loads the thumbnails
checkEmojiListContainer = () => {
    const eli = document.querySelector('.emoji-list-container')
    eli.innerHTML === '' ? socket.emit('showEmojiList', true) : eli.style.display = 'flex'
}

// Receiving list of emoji thumbnails
socket.on('sendList', (list) => {
    document.querySelector('.emoji-list-container').innerHTML = ''
    document.querySelector('.emoji-list-container').style.display = 'flex'
    list.forEach(emoji => {
        // console.log(emoji)
        const div = document.createElement('div')
        div.classList.add('emoji-div')
        div.style.backgroundImage = 'url("../shapes/' + emoji + '")'
        div.id = emoji
        div.addEventListener('click', e => socket.emit('loadSpecificEmoji', emoji))
        document.querySelector('.emoji-list-container').appendChild(div)
    })
})

// Socket to receive the SVG-string of the clicked emoji
socket.on('sendLoadedEmoji', (svg) => {
    fabric.loadSVGFromString(svg, (objects, options) => {
        const groupObjects = []
        objects.forEach((obj, i) => {
            groupObjects.push(obj)
        });
        canvas.add(new fabric.Group(groupObjects, { left: window.innerWidth / 2, top: window.innerHeight / 2 }))
    })
    canvas.renderAll()
    document.querySelector('.emoji-list-container').style.display = 'none'
    resetAllTools()
})

// Event listeners for version control
canvas.on('object:removed', stackCanvasChanges);
canvas.on('object:modified', stackCanvasChanges);
canvas.on('object:added', stackCanvasChanges);

let undoButton = document.querySelector('.undo-button').addEventListener('click', undoAction)
let redoButton = document.querySelector('.redo-button').addEventListener('click', redoAction)
let emojiBtn = document.querySelector('.spawn-emoji').addEventListener('click', checkEmojiListContainer)
