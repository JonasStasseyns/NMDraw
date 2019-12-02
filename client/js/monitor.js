const socket = io()

const body = document.querySelector('body')
const canvas = window._canvas = new fabric.Canvas('c');
canvas.setWidth(window.innerWidth)
canvas.setHeight(window.innerHeight)

let init = true

socket.on('drawing', (data) => {
    if(!init){
        canvas.clear()
    }
    console.log(data);
    fabric.loadSVGFromString(data, function(objects, options) {
        const obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).renderAll();
    })
    init = false
});

loadCanvas = (data) => {
    fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: 'rgba(102,153,255,0.5)',
        cornerSize: 12,
        padding: 5
    });
}
