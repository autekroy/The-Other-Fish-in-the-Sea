var canvas;
var gl;

var numTimesToSubdivide = 6;
 
var index = 0;  // triangle points number

var points = [];
var normals = [];

var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(2.0, 0, -3.0, 0.0 ); // vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var square = [
    vec3(0, 0, 0),
    vec3(1, 0, 0),
    vec3(1, 1, 0),
    vec3(0, 1, 0)
];

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

// for naviggation system
var unit = 0.5;
var altitude = 0;
var theta = 1.5;


var diffuseProductLoc;
var specularProductLoc;
var lightPositionLoc;
var shininessLoc;

// for texture
// var imageSrc = "/resource/head.png"
var uv = [];


function triangle(a, b, c) {

     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t1, t2));
     normal = vec4(normal);

     normals.push(normal);
     normals.push(normal);
     normals.push(normal);

     
     points.push(a);
     points.push(b);      
     points.push(c);

     index += 3;
}

function Cube(vertices, points, normals, uv, uv2){
    // six faces of a cube
    Quad(vertices, points, normals, uv, uv2, 0, 1, 2, 3, vec3(0, 0, 1));
    Quad(vertices, points, normals, uv, uv2, 4, 0, 6, 2, vec3(0, 1, 0));
    Quad(vertices, points, normals, uv, uv2, 4, 5, 0, 1, vec3(1, 0, 0));
    Quad(vertices, points, normals, uv, uv2, 2, 3, 6, 7, vec3(1, 0, 1));
    Quad(vertices, points, normals, uv, uv2, 6, 7, 4, 5, vec3(0, 1, 1));
    Quad(vertices, points, normals, uv, uv2, 1, 5, 3, 7, vec3(1, 1, 0));
}

function Quad( vertices, points, normals, uv, uv2, v1, v2, v3, v4, normal){

    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);

    // for normal texture coordinate
    uv.push(vec2(0,0));
    uv.push(vec2(1,0));
    uv.push(vec2(1,1));
    uv.push(vec2(0,0));
    uv.push(vec2(1,1));
    uv.push(vec2(0,1));

    // for zoom-out
    uv2.push(vec2(0,0));
    uv2.push(vec2(2,0));
    uv2.push(vec2(2,2));
    uv2.push(vec2(0,0));
    uv2.push(vec2(2,2));
    uv2.push(vec2(0,2));

    // 6 points to form 2 triangels, which can combine to a
    // points.push(vertices[v1]);
    // points.push(vertices[v3]);
    // points.push(vertices[v4]);
    // points.push(vertices[v1]);
    // points.push(vertices[v4]);
    // points.push(vertices[v2]);

    points.push(vec4(vertices[v1], 1));
    points.push(vec4(vertices[v3], 1));
    points.push(vec4(vertices[v4], 1));
    points.push(vec4(vertices[v1], 1));
    points.push(vec4(vertices[v4], 1));
    points.push(vec4(vertices[v2], 1));
}

function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // for cubes
    vertices = [
        vec3(  length,   length, length ), //vertex 0
        vec3(  length,  -length, length ), //vertex 1
        vec3( -length,   length, length ), //vertex 2
        vec3( -length,  -length, length ),  //vertex 3 
        vec3(  length,   length, -length ), //vertex 4
        vec3(  length,  -length, -length ), //vertex 5
        vec3( -length,   length, -length ), //vertex 6
        vec3( -length,  -length, -length )  //vertex 7   
    ];

    
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);


    // first cube with texture
    myTexture = gl.createTexture();
    myTexture.image = new Image();

    myTexture.image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, myTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
        
        //use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    // myTexture.image.src = imageSrc;
    
    // Cube(vertices, points, normals, uv, uv2);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");

    render();
}


function worldViewMatrix(){
    modelViewMatrix = lookAt(eye, at , up);
    modelViewMatrix = mult(modelViewMatrix, rotate(altitude, [1, 0, 0])); //change the altitude of the whold world
    modelViewMatrix = mult(modelViewMatrix, rotate(theta, [0, 1, 0]));      //rotate the whole world    
}

var deg  = 180;
var degUnit = 20;

function drawPeople(){
    worldViewMatrix();

    modelViewMatrix = mult(modelViewMatrix, rotate(-20, [1, 0, 0]));

    materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
    materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    materialShininess = 100.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
    gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
    gl.uniform4fv( specularProductLoc,flatten(specularProduct) );   
    gl.uniform1f( shininessLoc ,materialShininess );

    // draw head
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, translate(0, 2, 0));
    ctm = mult(ctm, scale(0.5, 0.5, 0.5));

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    // draw body
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);    
    ctm = mult(ctm, translate(0, 0, 0));
    ctm = mult(ctm, scale(0.3, 1.5, 0.3));

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );
    
    deg += degUnit;
    if(deg == 240)   degUnit = -degUnit;
    else if(deg == 120) degUnit = -degUnit;

    // draw right hand
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, translate(0.8, 0.7, 0));
    ctm = mult(ctm, rotate( -deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(-45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    // draw left hand
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);    
    ctm = mult(ctm, translate(-0.8, 0.7, 0));
    ctm = mult(ctm, rotate(deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    // ctm = mult(ctm, translate(-0.8, 0.3, 0));
    // ctm = mult(ctm, rotate(-45, [0, 0, 1]));
    // ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    // draw right foot
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, translate(0.6, -1.5, 0));
    ctm = mult(ctm, rotate(deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(-45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    // draw left foot
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, translate(-0.6, -1.5, 0));
    ctm = mult(ctm, rotate( -deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );

}

var upDis = -2, bubbleSize = 0.1;
function drawBubble(up, larger){

    worldViewMatrix();
    
    upDis += 0.03;
    bubbleSize += 0.001;

    if(upDis >= 2.5){
        upDis = -2.5;
        bubbleSize = 0.1;
    }

    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, translate(4, upDis, 1.5));
    ctm = mult(ctm, scale(bubbleSize, bubbleSize, bubbleSize));

    materialAmbient = vec4( 0.7, 0.7, 1.0, 1.0 );
    materialDiffuse = vec4( 0.6, 0.6, 1.0, 1.0 );
    materialSpecular = vec4( 0.8, 0.8, 1.0, 1.0 );
    materialShininess = 200.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
    gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
    gl.uniform4fv( specularProductLoc,flatten(specularProduct) );   
    gl.uniform1f( shininessLoc ,materialShininess );

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );

    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );    
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    drawPeople();

    drawBubble(1, 0.001);

    window.requestAnimFrame(render);
}
