
let canvas = null;
let canvasW = 0;
let canvasH = 0;

let d = 0.1; //viewport z axis position
let viewPortW = 1.0;
let viewPortH = 1.0;
let translateX = 0;
let translateY = 0;
let deltaX = 0.01;
let deltaY = 0.01;
let angle = 0;
let deltaAngle = 5;

function init(){
    canvas = document.getElementById("canvas");

    canvasW = document.body.offsetWidth;
    canvasH = document.body.offsetHeight;

    canvas.width = canvasW;
    canvas.height = canvasH;

    setInterval(()=>{
        requestAnimationFrame(draw);
    }, 500);
}

function rotate(x,y,angle){
    let rad = Math.PI * angle / 180.0;
    let sin = Math.sin(rad);
    let cos = Math.cos(rad);

    let rotx = x*sin + y*cos;
    let roty = x*cos - y*sin;

    return [rotx, roty];
}

function transformPoint(p1x, p1y, p1z, angle){
    /*let rot = rotate(p1x, p1y, angle);
    let rotx = p1x; //rot[0];
    let roty = p1y; //rot[1];
    let rotz = p1z;*/

    let rot = rotate(p1x, p1y, angle);
    let rotx = rot[0];
    let roty = rot[1];
    let rotz = p1z;

    /*let rot = rotate(p1x, p1z, angle);
    let rotx = rot[1];
    let roty = p1y;
    let rotz = rot[0];*/

     //apply perspective (from 3D to 2D)
     let np1x = (rotx / rotz) * d;
     let np1y = (roty / rotz) * d;

    //convert to canvas coordinates


    np1x = (np1x + 0.5) * canvasW;
    np1y = (np1y + 0.5) * canvasW;

    np1x = Math.round(np1x);
    np1y = Math.round(np1y);

    np1y = canvasH - np1y;

    return [np1x, np1y];
}

function draw(){
    let pz = 0.6;
    let pz2 = 1.0;

    let vertsFront = [
        [-1, 1, pz],
        [1, 1,  pz],
        [1, -1, pz],
        [-1, -1, pz]];

    let vertsBack = [
        [-1, 1, pz2],
        [1, 1, pz2],
        [1, -1, pz2],
        [-1, -1, pz2]
    ];

    let triangles = [
        [vertsFront[0], vertsFront[1], vertsFront[3]],
        [vertsFront[1], vertsFront[2], vertsFront[3]],

        [vertsFront[1], vertsBack[1], vertsBack[2]],
        [vertsFront[1], vertsFront[2], vertsBack[2]],

        [vertsFront[0], vertsFront[1], vertsBack[1]],
        [vertsFront[0], vertsBack[0], vertsBack[1]],

        [vertsFront[0], vertsFront[3], vertsBack[0]],
        [vertsBack[0], vertsBack[3], vertsFront[3]],

        [vertsFront[3], vertsFront[2], vertsBack[2]],
        [vertsFront[3], vertsBack[3], vertsBack[2]],

        [vertsBack[0], vertsBack[1], vertsBack[3]],
        [vertsBack[1], vertsBack[2], vertsBack[3]],
    ];

    angle += deltaAngle;
    let colors = ["green", "green", "blue", "blue", "red", "red", "yellow", "yellow", "orange", "orange", "black", "black"];
    let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvasW, canvasH);

    for(let i = 0; i < triangles.length; i++){
        let triangle1 = triangles[i];
        let pt1 = triangle1[0];
        let pt2 = triangle1[1];
        let pt3 = triangle1[2];
    
        let p1 = transformPoint(pt1[0], pt1[1], pt1[2], angle);
        let p2 = transformPoint(pt2[0], pt2[1], pt2[2], angle);
        let p3 = transformPoint(pt3[0], pt3[1], pt3[2], angle);

    
        let region = new Path2D();
        region.moveTo(p1[0], p1[1]);
        region.lineTo(p2[0], p2[1]);
        region.lineTo(p3[0], p3[1]);
        region.closePath();
    
        ctx.fillStyle = colors[i];
        ctx.fill(region);
    }
}

window.onload = init;