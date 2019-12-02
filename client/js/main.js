let can = new fabric.Canvas('c')

const socket = io()
    //
    // socket.on('drawing', (data) => {
    //     console.log(data);
    //     console.log('any')
    // });
    //
    // const canvas = document.querySelector('.canvas')
    // const context = canvas.getContext('2d')
    // const display = document.querySelector('.display')
    //
    // let currentColor = 'black'
    //
    // canvas.width = window.innerWidth
    // canvas.height = window.innerHeight
    //
    // let isDrawing = false
    //
    // startDrawing = () => {
    //     isDrawing = true
    // }
    //
    // stopDrawing = () => {
    //     isDrawing = false
    //     context.beginPath()
    //     sendCanvas()
    // }
    //
    // drawLine = (e) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     if (isDrawing) {
    //         context.lineWidth = 5
    //         context.lineCap = 'round'
    //         context.lineTo(e.clientX, e.clientY)
    //         context.stroke()
    //         context.strokeStyle = currentColor
    //         context.beginPath()
    //         context.moveTo(e.clientX, e.clientY)
    //     }
    // }
    //
    // setColor = (e) => {
    //     currentColor = e.target.className.split(' ')[1]
    // }
    //
    // canvas.addEventListener('mousedown', startDrawing)
    // canvas.addEventListener('mouseup', stopDrawing)
    // canvas.addEventListener('mousemove', drawLine)
    //
    // const colors = document.querySelectorAll('.color')
    // colors.forEach((color) => {
    //     color.addEventListener('click', setColor)
    // })
    //
    // sendCanvas = () => {
    //     socket.emit('drawing', context)
    // }
    // Do some initializing stuff
fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(102,153,255,0.5)',
    cornerSize: 12,
    padding: 5
});

// initialize fabric canvas and assign to global windows object for debug
const canvas = window._canvas = new fabric.Canvas('c');
canvas.setWidth(1000)
canvas.setHeight(1000)

canvas.add(new fabric.Circle({
    radius: 50,
    left: 100,
    top: 100,
    fill: '#0B61A4'
}));

canvas.add(new fabric.Triangle({
    width: 150,
    height: 100,
    left: 160,
    top: 200,
    fill: '#00AF64'
}));

// Normal SVG output
fabric.log('Normal SVG output: ', canvas.toSVG());

// SVG output without preamble
fabric.log('SVG output without preamble: ', canvas.toSVG({
    suppressPreamble: true
}));

// SVG output with viewBox attribute
fabric.log('SVG output with viewBox attribute: ', canvas.toSVG({
    viewBox: {
        x: 80,
        y: 80,
        width: 250,
        height: 250
    }
}));

document.querySelector('body').addEventListener('click', (evt) => {
    socket.emit('drawing', canvas.toSVG())
})