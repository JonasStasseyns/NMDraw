const socket = io()

socket.emit('testPL', {
    name: 'test payload',
    author: 'Arvellon'
})

const canvas = document.querySelector('.canvas')
const context = canvas.getContext('2d')

let currentColor = 'black'

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let isDrawing = false

startDrawing = () => {
    isDrawing = true
}

stopDrawing = () => {
    isDrawing = false
    context.beginPath()
}

drawLine = (e) => {
    if(isDrawing){
        context.lineWidth = 5
        context.lineCap = 'round'
        context.lineTo(e.clientX, e.clientY)
        context.stroke()
        context.strokeStyle = currentColor
        context.beginPath()
        context.moveTo(e.clientX, e.clientY)
    }
}

setColor = (e) => {
    currentColor = e.target.className.split(' ')[1]
}

canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mousemove', drawLine)

const colors = document.querySelectorAll('.color')
colors.forEach((color) => {
    color.addEventListener('click', setColor)
})
