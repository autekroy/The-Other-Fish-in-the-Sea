var canvas;
var gl;
var length = 0.5;
var time = 0.0;
var timer = new Timer();
var omega = 360;

var UNIFORM_mvpMatrix;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;

var positionBuffer; 
var normalBuffer;

var myTexture;

var viewMatrix;
var projectionMatrix;
var mvpMatrix;

var shininess = 50;
var lightPosition = vec3(0.0, 10.0, 0.0);

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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    // gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

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

    var points = [];
    var normals = []; 
    
    Cube(vertices, points, normals, uv, uv2); // original cube with full size texture picture

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

    UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
    UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");

    timer.reset();
    gl.enable(gl.DEPTH_TEST);

    render();
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
    uv.push(vec2(4,0));
    uv.push(vec2(4,4));
    uv.push(vec2(0,0));
    uv.push(vec2(4,4));
    uv.push(vec2(0,4));

    // 6 points to form 2 triangels, which can combine to a
    points.push(vertices[v1]);
    points.push(vertices[v3]);
    points.push(vertices[v4]);
    points.push(vertices[v1]);
    points.push(vertices[v4]);
    points.push(vertices[v2]);
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 1 * distance, 1.8 * distance);
    viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, 1, 0.001, 1000);

    time += timer.getElapsedTime() / 1000;

    myMatrix = viewMatrix;
    myMatrix = mult(myMatrix, scale(10, 0.1, 10));

    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(myMatrix));
    gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
    
    if(textureScroll == 1){
        for(var i = 0; i < uv.length; i++){
            uv[i][1] -= 0.01;

            // reset all the texture coordinate incase they are too low to get overflow.
            if(uv[i][1] <= -1000000){
                for(var j = 0; j < uv.length; j++)
                    uv[j][1] += 10;
            }
        }
    }  

    uvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(uv), gl.STATIC_DRAW );      //uv data

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0)

    window.requestAnimFrame( render );
}
