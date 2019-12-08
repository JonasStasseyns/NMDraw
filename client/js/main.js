const socket = io()

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(102,153,255,0.5)',
    cornerSize: 20,
    padding: 5
});

// initialize fabric canvas and assign to global windows object for debug
const canvas = window._canvas = new fabric.Canvas('c');
canvas.setWidth(window.innerWidth)
canvas.setHeight(window.innerHeight)

document.querySelector('h1').addEventListener('click', (e) => {
    canvas.remove(canvas.getActiveObject())
})



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

document.querySelector('.create-shape-btn').addEventListener('click', createShape)

document.querySelector('body').addEventListener('click', () => {
    socket.emit('drawing', canvas.toSVG())
})
