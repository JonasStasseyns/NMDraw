// Do some initializing stuff
fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(102,153,255,0.5)',
    cornerSize: 12,
    padding: 5
});

// initialize fabric canvas and assign to global windows object for debug
var canvas = window._canvas = new fabric.Canvas('c');

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