const socket = io()

socket.emit('usr', prompt('Enter a username:'))

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(102,153,255,0.5)',
    cornerSize: 20,
    padding: 5
});

// Global variables
let isDrawing = false

// Canvas Init
const canvas = window._canvas = new fabric.Canvas('c');
canvas.setWidth(window.innerWidth)
canvas.setHeight(window.innerHeight)

// Remove active shape
document.querySelector('h1').addEventListener('click', (e) => {
    canvas.remove(canvas.getActiveObject())
})

// Drawing Test
toggleDraw = () => {
    // TODO Change ui button based on isDrawing
    isDrawing = !isDrawing
    console.log(isDrawing)
    document.querySelector('.free-draw-toggle-icon').style.color = (isDrawing) ? 'red' : 'black'
    canvas.isDrawingMode = (isDrawing) ? 1 : 0;
    canvas.freeDrawingBrush.color = 'black';
    canvas.freeDrawingBrush.width = document.querySelector('.brush-size').value;
    canvas.renderAll();
}

// Create a start shape for debugging
canvas.add(new fabric.Triangle({
    width: 150,
    height: 100,
    left: 160,
    top: 200,
    fill: '#00AF64'
}));

// Create shape based on the selected shape and size
createShape = () => {
    const radios = document.querySelectorAll('.shape-selector-unit')
    radios.forEach((radio) => {
        if(radio.checked){
            switch (radio.value) {
                case 'circle':
                    canvas.add(new fabric.Circle({
                        radius: document.querySelector('.shape-size').value,
                        left: 100,
                        top: 100,
                        fill: '#0B61A4'
                    }));
                    break;
                case 'triangle':
                    canvas.add(new fabric.Triangle({
                        width: document.querySelector('.shape-size').value,
                        height: document.querySelector('.shape-size').value,
                        left: 100,
                        top: 100,
                        fill: '#0B61A4'
                    }));
                    break;
                case 'rectangle':
                    canvas.add(new fabric.Rect({
                        width: document.querySelector('.shape-size').value,
                        height: document.querySelector('.shape-size').value,
                        left: 100,
                        top: 100,
                        fill: '#0B61A4'
                    }));
                    break;
            }

        }else{
            console.log(radio)
            console.log('NO')
        }
    })
}

// Event Listeners
// TODO Add shape selector evtlistener + shape select store
document.querySelector('.create-shape-btn').addEventListener('click', createShape)
document.querySelector('.free-draw-toggle-icon').addEventListener('click', toggleDraw)

// Body click event to send changes to the server
document.querySelector('body').addEventListener('click', () => {
    socket.emit('drawing', canvas.toSVG())
})
