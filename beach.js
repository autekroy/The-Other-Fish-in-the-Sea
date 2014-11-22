var canvas;
var gl;
var length = 0.5;
var time = 0.0;
var timer = new Timer();
var omega = 360;


var numTimesToSubdivide = 1;

var points = [];
var normals = []; 

var UNIFORM_lightPosition;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;

var positionBuffer; 
var normalBuffer;

var myTexture, BubbleTexture;

var viewMatrix;
var projectionMatrix;
var mvpMatrix;

var shininess = 50;
var lightPosition = vec3(0.0, 20.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var diffuseProductLoc;
var specularProductLoc;
var lightPositionLoc;
var shininessLoc;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye = vec3(0, 1, 1.8);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var ifRotate = 0; // control  the rotation of both cubes.
var textureRotate = 0; // start and stop the rotation of the texture maps on all faces of the first cube
var textureScroll = 0; // start and stop the continuous scrolling the texture map on the second cube

var imageSrc = "/resource/sandycheeks.jpg"

var theta = 0.01;

var distance = 1;
var fovy = 90;
var uv = [], uv2 = [];


// for naviggation system
var unit = 2;
var altitude = 0;
var theta = 1.5;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.4, 0.4, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

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

    
    Cube(vertices, points, normals, uv, uv2); // original cube with full size texture picture

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    // first cube with texture
    myTexture = gl.createTexture();
    myTexture.image = new Image();

    myTexture.image.onload = function(){
    	gl.bindTexture(gl.TEXTURE_2D, myTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    	gl.generateMipmap(gl.TEXTURE_2D);
    	gl.bindTexture(gl.TEXTURE_2D, null);
    }
    myTexture.image.src = imageSrc;

    BubbleTexture = gl.createTexture();
    BubbleTexture.image = new Image();    

    BubbleTexture.image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, BubbleTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, BubbleTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    BubbleTexture.image.src = "/resource/bubble.png";


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );  //cubes' point position

    normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW ); //cubes' normal data

    uvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(uv), gl.STATIC_DRAW );      //uv data

    uvBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(uv2), gl.STATIC_DRAW );      //uv data

    ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( ATTRIBUTE_normal );

    ATTRIBUTE_uv = gl.getAttribLocation( program, "vUV" );
    gl.enableVertexAttribArray( ATTRIBUTE_uv);

    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

    modelViewMatrixLoc = gl.getUniformLocation(program, "mvMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");
    UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");

    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");

    timer.reset();
    gl.enable(gl.DEPTH_TEST);

    render();
}

function worldViewMatrix(){
    modelViewMatrix = lookAt(eye, at , up);
    modelViewMatrix = mult(modelViewMatrix, rotate(altitude, [1, 0, 0])); //change the altitude of the whold world
    modelViewMatrix = mult(modelViewMatrix, rotate(theta, [0, 1, 0]));      //rotate the whole world    
}

var upDis = -2, bubbleSize = 0.2;
function drawBubble(xvalue, zvalue){

    worldViewMatrix();
    
    upDis += 0.03;
    bubbleSize += 0.001;

    if(upDis >= 2.5){
        upDis = -2.5;
        bubbleSize = 0.1;
    }

    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, translate(0, 100, -4));
    ctm = mult(ctm, scale(0.2, 0.2, 5));

    ctm = mult(ctm, translate(xvalue, upDis, zvalue));
    ctm = mult(ctm, scale(bubbleSize, bubbleSize, bubbleSize));

    materialAmbient = vec4( 0.7, 0.7, 1.0, 1.0 );
    materialDiffuse = vec4( 0.6, 0.6, 1.0, 1.0 );
    materialSpecular = vec4( 0.8, 0.8, 1.0, 1.0 );
    materialShininess = 200.0;

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // gl.uniform4fv( lightPositionLoc,  flatten(lightPosition) );
    // gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
    // gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
    // gl.uniform4fv( specularProductLoc,flatten(specularProduct) );   
    // gl.uniform1f( shininessLoc ,materialShininess );

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );

    for( var i = 36; i < index + 36; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );    
}
var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 1 * distance, 1.8 * distance);

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(90, 1, 0.01, 1000);
    // projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    time += timer.getElapsedTime() / 1000;

    myMatrix = modelViewMatrix;
    myMatrix = mult(myMatrix, scale(10, 0.1, 10));
    
    if(textureScroll == 1){
        for(var i = 0; i < 36; i++){
            uv[i][1] -= 0.02;
            // reset all the texture coordinate incase they are too low to get overflow.
            if(uv[i][1] <= -1000000){
                for(var j = 0; j < 36; j++)
                    uv[j][1] += 10;
            }
        }
    }

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(myMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    uvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(uv), gl.STATIC_DRAW );      //uv data

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(shininessLoc,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0)

    // bubble
    BubbleuvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, BubbleuvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(bubbleUv), gl.STATIC_DRAW );      //uv data

    gl.bindBuffer( gl.ARRAY_BUFFER, BubbleuvBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, BubbleTexture);

    //drawBubble(0, 0);
    worldViewMatrix();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    for( var i = 36; i < index + 36; i+=3)  
        gl.drawArrays( gl.TRIANGLES, i, 3 );   


    window.requestAnimFrame( render );
}
