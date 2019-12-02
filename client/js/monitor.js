const socket = io()

const body = document.querySelector('body')
const canvas = document.querySelector('.mon-canvas')

socket.on('drawing', (data) => {
    console.log(data);
    // const img = document.createElement('img')
    // img.classList.add('drawing-img')
    // img.src = data.data
    // body.appendChild(img)
    // canvas.add(data.clone());
});
