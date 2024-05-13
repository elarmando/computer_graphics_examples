function persp(x,z){
    return fov * x / z;
}

function add(v0, v1){
    return [v0[0]+v1[0], v0[1]+v1[1], v0[2]+v1[2]];
}

function project(v){
    return [innerWidth/2+persp(v[0], v[2]), innerHeight/2+persp(v[1],v[2])];
}

function facingSide(x0, y0, x1, y1, x2, y2){
    return (x1-x0)*(y2-y0) -(x2-x0)*(y1-y0);
}

function rotate2D(x, z, rad){
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [x*c-z*s, x*s+z*c];
}

function convert3D(v){
    var rv0 = rotate2D(v[0], v[2], objR[1]);
    var rv1 = rotate2D(v[1], rv0[1], objR[0]);
    var nv = [rv0[0],rv1[0],rv1[1]];
    var p = project(add(nv, camP));
    return p;
}

var verts = [
    [-1, -1, -1],
    [1, -1, -1],
    [-1, 1, -1],
    [1, 1, -1],

    [-1, -1, 1],
    [1, -1, 1],
    [-1, 1, 1],
    [1, 1, 1]
];

var faces = [
    [0,1,2, [255,0,0]],
    [2,1,3, [255,0,0]],

    [4,5,6, [0,255,0]],
    [6,5,7, [0,255,0]],

    [3,5,7, [0,0,255]],
    [3,1,5, [0,0,255]],

    [2,4,6, [255,0,255]],
    [2,0,4, [255,0,255]],

    [0,4,5, [255,255,0]],
    [1,0,5, [255,255,0]],

    [3,2,6, [0, 255, 255]],
    [6,3,7, [0, 255, 255]]
];
var edges = [0, 1];
var objR = [0, 0];
var camP = [0, 0, 3];
var fov = innerWidth / 2;

function frame(){
    c = document.querySelector("canvas");
    c.width = innerWidth;
    c.height = innerHeight;
    ctx = c.getContext("2d");

    objR[1] = Date.now()/3000;
    objR[0] = Date.now()/2000;

    for(var i = 0; i < faces.length; i++){
       ctx.strokeStyle = "rgb(" + faces[i][3] + ")";
       ctx.fillStyle =  "rgb(" + faces[i][3] + ")";

       var p0 = convert3D(verts[faces[i][0]]);
       var p1 = convert3D(verts[faces[i][1]]);
       var p2 = convert3D(verts[faces[i][2]]);

       ctx.beginPath();
       ctx.moveTo(p0[0], p0[1]);
       ctx.lineTo(p1[0], p1[1]);
       ctx.lineTo(p2[0], p2[1]);
       ctx.lineTo(p0[0], p0[1]);
       ctx.fill();
       ctx.closePath();
    }
}

(()=> setInterval(frame))();