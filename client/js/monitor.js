const socket = io()

const body = document.querySelector('body')

socket.on('drawing', (data) => {
    console.log(data);
    const img = document.createElement('img')
    img.classList.add('drawing-img')
    img.src = data.data
    body.appendChild(img)
});
