const socket = io()

const body = document.querySelector('body')
const canvas = window._canvas = new fabric.Canvas('c');


socket.on('drawing', (data) => {
    console.log(data);
    fabric.loadSVGFromString(data, function(objects, options) {
        const obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).renderAll();
    })
});

loadCanvas = (data) => {
    fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: 'rgba(102,153,255,0.5)',
        cornerSize: 12,
        padding: 5
    });
}
