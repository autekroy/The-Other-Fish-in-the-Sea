/*

This file contains the init() and render() functions!

*/

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.4, 0.4, 0.8, 1.0 );
    
    // Camera settings I guess
    viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fieldOfView, aspectRatio, 0.001, 1000);
    projectionMatrix = mult(projectionMatrix, translate(0,-1,-4));

    gl.enable(gl.DEPTH_TEST);

    // Create the points, vertices, and UV maps for a cube object!
    cubePoints = [];
    cubeNormals = [];
    cubeUV = [];
    Cube(length, cubePoints, cubeNormals, cubeUV, uv2);

    // Create the points, vertices, and UV maps for a sphere object!
    spherePoints = [];
    sphereNormals = [];
    sphereUV = [];
    sphereIndex = 0;
    createSphere(3, spherePoints, sphereNormals, sphereUV)

    // first cube with texture
    myTexture = gl.createTexture();
    myTexture.image = new Image();
    myTexture.image.onload = function() {
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

    // Texture for sphere
    BubbleTexture = gl.createTexture();
    BubbleTexture.image = new Image();    
    BubbleTexture.image.onload = function() {
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

    // Process Shaders (or something like that)
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create buffers for the cube!
    cubePositionBuffer = gl.createBuffer();
    cubeNormalBuffer = gl.createBuffer();
    cubeUVBuffer = gl.createBuffer();

    // Create buffers for the sphere!
    spherePositionBuffer = gl.createBuffer();
    sphereNormalBuffer = gl.createBuffer();
    sphereUVBuffer = gl.createBuffer();

    // Create the variables to pass to the shaders!
    ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );
    ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( ATTRIBUTE_normal );
    // uvBuffer2 = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(uv2), gl.STATIC_DRAW );      //uv data
    ATTRIBUTE_uv = gl.getAttribLocation( program, "vUV" );
    gl.enableVertexAttribArray( ATTRIBUTE_uv);

    // Matrix things
    UNIFORM_viewMatrix = gl.getUniformLocation(program, "viewMatrix");
    UNIFORM_modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    UNIFORM_projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");

    // Lighting things
    UNIFORM_ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    UNIFORM_diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    UNIFORM_specularProduct = gl.getUniformLocation(program, "specularProduct");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");

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
// Commenting it out because we don't really need this for now lol - Brandon Ly
// function drawBubble(xvalue, zvalue) {

//     worldViewMatrix();
    
//     upDis += 0.03;
//     bubbleSize += 0.001;

//     if(upDis >= 2.5){
//         upDis = -2.5;
//         bubbleSize = 0.1;
//     }

//     ctm = mat4();
//     ctm = mult(ctm, modelViewMatrix);
//     ctm = mult(ctm, translate(0, 100, -4));
//     ctm = mult(ctm, scale(0.2, 0.2, 5));

//     ctm = mult(ctm, translate(xvalue, upDis, zvalue));
//     ctm = mult(ctm, scale(bubbleSize, bubbleSize, bubbleSize));

//     materialAmbient = vec4( 0.7, 0.7, 1.0, 1.0 );
//     materialDiffuse = vec4( 0.6, 0.6, 1.0, 1.0 );
//     materialSpecular = vec4( 0.8, 0.8, 1.0, 1.0 );
//     materialShininess = 200.0;

//     ambientProduct = mult(lightAmbient, materialAmbient);
//     diffuseProduct = mult(lightDiffuse, materialDiffuse);
//     specularProduct = mult(lightSpecular, materialSpecular);

//     // gl.uniform4fv( lightPositionLoc,  flatten(lightPosition) );
//     // gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
//     // gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
//     // gl.uniform4fv( specularProductLoc,flatten(specularProduct) );   
//     // gl.uniform1f( shininessLoc ,materialShininess );

//     gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );

//     for( var i = 36; i < index + 36; i+=3) 
//         gl.drawArrays( gl.TRIANGLES, i, 3 );    
// }

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 1 * distance, 1.8 * distance);

    modelViewMatrix = lookAt(eye, at, up);

    gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(viewMatrix));

    // projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    time += timer.getElapsedTime() / 1000;

    ////////////////////////////////
    // Render the Ocean Floor!
    ////////

    // Bind position buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, cubePositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
    // Bind normal buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeNormals), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );
    // Bind UV buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    var oceanFloor = mat4();
    oceanFloor = mult(oceanFloor, scale(10, 0.00001, 10));
    oceanFloor = mult(oceanFloor, translate(0,0,1.5));
    oceanFloor = mult(oceanFloor, viewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(oceanFloor));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    ////////////////////////////////
    // Render the sphere!
    ////////////////

    // Bind position buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, spherePositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(spherePoints), gl.STATIC_DRAW );  //cubes' point position
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
    // Bind normal buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereNormals), gl.STATIC_DRAW ); //cubes' normal data
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );    
    // Bind UV buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereUV), gl.STATIC_DRAW );      //uv data
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
    
    var bubble = mat4();
    bubble = mult(bubble, translate(0, 1, 0));
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(bubble));
    gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, BubbleTexture);

    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0);

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    //////////////////////////////////////////////////////////////////

    worldViewMatrix();

    window.requestAnimFrame( render );
}


