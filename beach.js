/*

This file contains the init() and render() functions!

*/

var program;
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
    projectionMatrix = mult(projectionMatrix, translate(0,-2,-4));

    gl.enable(gl.DEPTH_TEST);

    // Create the points, vertices, and UV maps for a cube object!
    cubePoints = [];
    cubeNormals = [];
    cubeUV = [];
    Cube(length, cubePoints, cubeNormals, cubeUV, stableUV);

    // Create the points, vertices, and UV maps for a sphere object!
    spherePoints = [];
    sphereNormals = [];
    sphereUV = [];
    sphereIndex = 0;
    createSphere(3, spherePoints, sphereNormals, sphereUV)

    defineTexture();

    // Process Shaders (or something like that)
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
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
     
}

function defineTexture() 
{
    oceanTexture = gl.createTexture();
    oceanTexture.image = new Image();
    oceanTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, oceanTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oceanTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    oceanTexture.image.src =  "/resource/underwaterBlue.jpg";

    beachOceanTexture = gl.createTexture();
    beachOceanTexture.image = new Image();
    beachOceanTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, beachOceanTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, beachOceanTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    beachOceanTexture.image.src =  "/resource/underwater2.jpg";

    beachTexture = gl.createTexture();
    beachTexture.image = new Image();
    beachTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, beachTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, beachTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    beachTexture.image.src =  "/resource/sandycheeks.jpg";


    silverTexture = gl.createTexture();
    silverTexture.image = new Image();
    silverTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, silverTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, silverTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    silverTexture.image.src =  "/resource/white.png";


    goldenTexture = gl.createTexture();
    goldenTexture.image = new Image();
    goldenTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, goldenTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, goldenTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    goldenTexture.image.src =  "/resource/yellow.png";


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


    //texture for underwater background
    waterBackgroundTexture = gl.createTexture();
    waterBackgroundTexture.image = new Image();
    waterBackgroundTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, waterBackgroundTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, waterBackgroundTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    waterBackgroundTexture.image.src = "/resource/underwaterBackground.jpg";

    //texture for beach background
    beachBackgroundTexture = gl.createTexture();
    beachBackgroundTexture.image = new Image();
    beachBackgroundTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, beachBackgroundTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, beachBackgroundTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    beachBackgroundTexture.image.src = "/resource/beachBackground.jpg";

    //texture for world rocks
    rockTexture = gl.createTexture();
    rockTexture.image = new Image();
    rockTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, rockTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rockTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rockTexture.image.src = "/resource/rockwall.jpg";


    monsterTexture = gl.createTexture();
    monsterTexture.image = new Image();
    monsterTexture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, monsterTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, monsterTexture.image);

        //for the zoomed texture, use tri-linear filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.GL_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    monsterTexture.image.src = "/resource/cubeMonster.png";

}

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;
var oceanDeg = 0, oceanDegUnit = 0.1;
var beachMove = 0, beachMoveUnit = 0.005;

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 1 * distance, 1.8 * distance);

    modelViewMatrix = lookAt(eye, at, up);

    projectionMatrix = perspective(fieldOfView, aspectRatio, 0.001, 1000);
    projectionMatrix = mult(projectionMatrix, translate(0,-2,-4));

    gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(viewMatrix));

    // projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    time += timer.getElapsedTime() / 1000;


if(onTheBeach == 1){
    ////////////////////////////////
    // Render the Ocean Floor!
    ////////
    if(walkForward == 1)
        beachMove += beachMoveUnit;
    else if(walkBackward == 1 && beachMove >= 0.03)
        beachMove -= beachMoveUnit;

    if(beachMove > 2.1)  onTheBeach = 0;

    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, beachMove));

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

    var beachFloor = mat4();

    beachFloor = mult(beachFloor, scale(30, 0.00001, 30));
    beachFloor = mult(beachFloor, translate(0,0,1));
    beachFloor = mult(beachFloor, modelViewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(beachFloor));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, beachTexture);

    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0);

    gl.drawArrays( gl.TRIANGLES, 0, 36);


    // render the beach background
    var beachFloor = mat4();

    beachFloor = mult(beachFloor, scale(30, 0.01, 30));
    beachFloor = mult(beachFloor, translate(0,0,-1.0));
    beachFloor = mult(beachFloor, modelViewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(beachFloor));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, beachOceanTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    // render beach background
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    rockWall = mat4();
    rockWall = mult(rockWall, translate(0, 30, -28));
    rockWall = mult(rockWall, scale(50, 16, 20));
    rockWall = mult(rockWall, modelViewMatrix);    

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, beachBackgroundTexture);
    gl.drawArrays( gl.TRIANGLES, 0, 36);

    ////////////////////////////////
    // Render the sphere!
    ////////////////

    // Bind position buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, spherePositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(spherePoints), gl.STATIC_DRAW );  //spheres' point position
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
    // Bind normal buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereNormals), gl.STATIC_DRAW ); //spheres' normal data
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );    
    // Bind UV buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereUV), gl.STATIC_DRAW );      //uv data
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, BubbleTexture);

    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0);

    createPeople(moveLeft, 0, moveForward, onTheBeach, walking);

}
else{
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

    // scrolling the cube (beach)
    if(textureScroll == 1){
        for(var i = 0; i < 36; i++){
            cubeUV[i][1] -= 0.04;
            cubeUV[i][0] -= textureLeft/100;
            // reset all the texture coordinate incase they are too low to get overflow.
            if(cubeUV[i][1] <= -1000000){
                for(var j = 0; j < 36; j++)
                    cubeUV[j][1] += 10;
            }
        }
    }

    // Bind UV buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    var oceanFloor = mat4();

    // oceanDeg += oceanDegUnit;
    // if(oceanDeg >= 8)   oceanDegUnit = -oceanDegUnit;
    // else if(oceanDeg <= -8) oceanDegUnit = -oceanDegUnit;
    // oceanFloor = mult(oceanFloor, rotate(oceanDeg, [1, 0, 0]));

    oceanFloor = mult(oceanFloor, scale(10, 0.00001, 10));
    oceanFloor = mult(oceanFloor, translate(0,0,1.5));
    oceanFloor = mult(oceanFloor, modelViewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(oceanFloor));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, oceanTexture);

    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0);

    gl.drawArrays( gl.TRIANGLES, 0, 36);


    ////////////////////////////////
    // Render the world rock
    ////////
    // for left rock wall
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    var rockWall = mat4();
    rockWall = mult(rockWall, translate(-10, 11, -13));
    rockWall = mult(rockWall, scale(1, 15, 15));
    rockWall = mult(rockWall, rotate(30, [0, 0, 1]));
    rockWall = mult(rockWall, rotate(270, [1, 0, 0]));
    rockWall = mult(rockWall, modelViewMatrix);   

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rockTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    // for right rock wall
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    rockWall = mat4();
    rockWall = mult(rockWall, translate(9, 11, -13));
    rockWall = mult(rockWall, scale(1, 15, 15));
    rockWall = mult(rockWall, rotate(30, [0, 0, 1]));
    rockWall = mult(rockWall, rotate(270, [1, 0, 0]));
    rockWall = mult(rockWall, modelViewMatrix);    

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rockTexture);
    gl.drawArrays( gl.TRIANGLES, 0, 36);

    /////////////////////////
    // render ocean background
    ////////////////////
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    rockWall = mat4();
    rockWall = mult(rockWall, translate(0, 30, -15));
    rockWall = mult(rockWall, scale(40, 20, 20));
    rockWall = mult(rockWall, modelViewMatrix);    

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, waterBackgroundTexture);
    gl.drawArrays( gl.TRIANGLES, 0, 36);


    ////////////////////////////////
    // Render monster
    ///////
    for(var i = 0; i < 4; i++)
        createMonster(i);

    ////////////////////////////////
    // Render sword
    ////////
    // createSword(4, 1, 2.1, -90);
    createSword(1.3 + moveLeft, 2.1, -1.3 + moveForward, 0);


    ////////////////////////////////
    // Render the sphere! (for Bubble and people)
    ////////////////

    // Bind position buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, spherePositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(spherePoints), gl.STATIC_DRAW );  //spheres' point position
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
    // Bind normal buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereNormals), gl.STATIC_DRAW ); //spheres' normal data
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );    
    // Bind UV buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereUV), gl.STATIC_DRAW );      //uv data
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, BubbleTexture);

    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0);

    createBubble(7, 1, -10);
    createBubble(-3, 1, -7);
    createBubble(3, 1, -2);
    createBubble(-5, 1, -3);
    // createTreasure(3, 0, -1);

    // createSwaweed(3, 0, -1);

    createPeople(moveLeft, 0, moveForward, onTheBeach, walkForward);

    worldViewMatrix();
}


    // try to make HP bar

    // // Bind position buffer
    // gl.bindBuffer( gl.ARRAY_BUFFER, cubePositionBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW );
    // gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
    // // // Bind normal buffer
    // // gl.bindBuffer( gl.ARRAY_BUFFER, cubeNormalBuffer );
    // // gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeNormals), gl.STATIC_DRAW );
    // // gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

    // // // Bind UV buffer
    // // gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    // // gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeUV), gl.STATIC_DRAW );
    // // gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    // var rockWall = mat4();
    // rockWall = mult(rockWall, translate(0, 2, 0));
    // // rockWall = mult(rockWall, scale(5, 5, 5));
    // // rockWall = mult(rockWall, rotate(30, [0, 0, 1]));
    // // rockWall = mult(rockWall, rotate(270, [1, 0, 0]));
    // // rockWall = mult(rockWall, modelViewMatrix);   

    // projectionMatrix = ortho(l, r, t, b, n, f);
    // // UNIFORM_projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    // gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));
    // gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

    // gl.drawArrays( gl.LINES, 0, 36);




    window.requestAnimFrame( render );
}


