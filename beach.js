/*

This file contains the init() and render() functions!


*/

var program;
//*****************************Michael's*******************************
var notPickUp = 1;//To decide whether to draw the fruit box or not
//*****************************Michael's*******************************

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.4, 0.4, 0.8, 1.0 );
    
    // Camera settings I guess
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fieldOfView, aspectRatio, 0.001, 1000);
    projectionMatrix = mult(projectionMatrix, translate(0,-2,-4));

    gl.enable(gl.DEPTH_TEST);

    // Create the points, vertices, and UV maps for a cube object!
    cubePoints = [];
    cubeNormals = [];
    cubeUV = [];
    Cube(length, cubePoints, cubeNormals, cubeUV, stableUV);

    // ------------- copy value of stableuv --------------------------------- //
    // if you just use moveNormalUV = stableUV, it will be pass by reference. (2 variable point to same address)
    // so I use slice() to only copy the value of array.
    // Because uv is an array of arrayes so I have to use slice() to every single stableUV[i].
    // ---------------------------------------------------------------- //
    for(var i = 0; i < stableUV.length; i++)
            moveNormalUV.push(stableUV[i].slice());

    // Create the points, vertices, and UV maps for a sphere object!
    spherePoints = [];
    sphereNormals = [];
    sphereUV = [];
    sphereIndex = 0;
    createSphere(3, spherePoints, sphereNormals, sphereUV)

    defineTexture();
    defineBumpMappingTexture();

    // Process Shaders (or something like that)
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

//*****************************Michael's*******************************
// Setup a FBO to put in the off-screen object in which will not be printed out on the canvas
    gl.enable(gl.CULL_FACE);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);

    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status != gl.FRAMEBUFFER_COMPLETE) {
        alert('Framebuffer Not Complete');
    }
//*****************************Michael's*******************************


    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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
    UNIFORM_bsampler = gl.getUniformLocation(program, "bSampler");

    // Lighting things
    UNIFORM_ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    UNIFORM_diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    UNIFORM_specularProduct = gl.getUniformLocation(program, "specularProduct");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");

    UNIFORM_usebumpmap = gl.getUniformLocation(program, "usebumpmap");

    timer.reset();
    gl.enable(gl.DEPTH_TEST);

//*****************************Michael's*******************************
//Detect mouse down
    canvas.addEventListener("mousedown", function() {
//Bind FBO instead of the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1i(gl.getUniformLocation(program, "colorSelector"), 1);//To set up i = 1 -> corresponding to fragment shader
//Draw the fruit box in the FBO
    eye = vec3(0, 1 * distance, 1.8 * distance);

    modelViewMatrix = lookAt(eye, at, up);

    projectionMatrix = perspective(fieldOfView, aspectRatio, 0.001, 1000);
    projectionMatrix = mult(projectionMatrix, translate(0,-2,-4));

    gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(modelViewMatrix));
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, movePosition));

    if (notPickUp == 1) {
        createFood(-1.5, 0, 0);
    }
//To get the mouse postion
    var x = event.clientX;
    var y = canvas.height - event.clientY;


    gl.disable(gl.DITHER);
//To get the pixel on that position
    var color = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
    //alert("R:" + color[0] + " G:" + color[1] + " B:" + color[2] + "; x: " + x + " y: " + y);

    var colorNames = [
    "background",
    "Treasure Box Full of Life!",
    "Red Cube",
    "Green Cube",
    "Yellow Cube",
    "magenta",
    "Blue Cube",
    "White Cube"
    ];
//To know what is picked
    var nameIndex = 0;
    if (color[0] == 255) nameIndex += 1;
    if (color[1] == 255) nameIndex += 2;
    if (color[2] == 255) nameIndex += 4;
    if (nameIndex == 1) {
        alert("You just picked up a " + colorNames[nameIndex]);
        notPickUp = 0;
        numLifePoints++;
    }

    //Bind everything back to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.uniform1i(gl.getUniformLocation(program, "colorSelector"), 0);//Set colorSelector back to 0 (fColor)
    gl.clear(gl.COLOR_BUFFER_BIT);

    });

//*****************************Michael's*******************************
    
    initAlphaBlending();
    
    render();


}

function worldViewMatrix(){
    modelViewMatrix = lookAt(eye, at , up);
    modelViewMatrix = mult(modelViewMatrix, rotate(altitude, [1, 0, 0])); //change the altitude of the whold world
     
}

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;
var oceanDeg = 0, oceanDegUnit = 0.1;
var movePosition = 0, movePositionUnit = 0.005;

var isFinalisland = 0;// as boolean to check if the beach is last island
var congraMessage = 0;

var waterLevelTime = [10, 10, 5];
var waterLevelIndex = 0;
var waterLevelNext = 1;

var backgroundPos = 0, prebgPos = 0;

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 1 * distance, 1.8 * distance);

    modelViewMatrix = lookAt(eye, at, up);

    projectionMatrix = perspective(fieldOfView, aspectRatio, 0.001, 1000);
    projectionMatrix = mult(projectionMatrix, translate(0,-2,-4));

    gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(modelViewMatrix));

    lightPosition = vec3(0, 50.0, 40);
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));

    // projectionMatrix = ortho(left, right, bottom, ytop, near, far);

if(onTheBeach == 1){
    ////////////////////////////////
    // Render the beach
    ////////
    inWave = 0;
    if(walkForward == 1)
        movePosition += movePositionUnit;
    else if(walkBackward == 1 && movePosition >= 0.03)
        movePosition -= movePositionUnit;

    if(isFinalisland == 1 && movePosition > 1.15){
        movePosition = 1.15;
    }
    else if(movePosition > 2.0){  
        onTheBeach = 0; //going to underwater
        movePosition = 0;
        walking = 0;
        waterLevelIndex = 0;
        timer.reset(); // reset timer before going to underwater
    }

    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, movePosition));

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
    
    ///////////////////
    // Render sand beach
    ///////////////////
    var beachFloor = mat4();

    beachFloor = mult(beachFloor, scale(20, 0.00001, 20));
    beachFloor = mult(beachFloor, translate(0,0,1));
    beachFloor = mult(beachFloor, modelViewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(beachFloor));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, beachTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, wallBumpMap);

    gl.uniform1i(UNIFORM_usebumpmap, 0);
    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1i(UNIFORM_bsampler, 1);

    gl.drawArrays( gl.TRIANGLES, 0, 36);
    gl.uniform1i(UNIFORM_usebumpmap, 0);

    /////////////////////////
    // render food
    ////////////////////////
    if (notPickUp == 1) {
        createFood(-1.5, 0, 0);
    }

    //////////////////////////
    // render final tresure
    //////////////////////////
    if(isFinalisland == 1)
        createCelebrity(0, 0, -25);

    //////////////////////////
    // render Texture box
    //////////////////////////
    // createTextureBox(-1, 0, -12);

    ////////////////////////////
    // render the beach ocean floor
    ////////////////////////////
    var beachFloor = mat4();

    beachFloor = mult(beachFloor, scale(20, 0.01, 20));
    beachFloor = mult(beachFloor, translate(0,0,-1.0));
    beachFloor = mult(beachFloor, modelViewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(beachFloor));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, beachOceanTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, floorBumpMap);

    gl.uniform1i(UNIFORM_usebumpmap, 1);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1i(UNIFORM_bsampler, 1);

    gl.drawArrays( gl.TRIANGLES, 0, 36);
    gl.uniform1i(UNIFORM_usebumpmap, 0);

    ////////////////////////////
    // render beach background
    ////////////////////////////
    modelViewMatrix = lookAt(eye, at, up);
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    var beachbg = mat4();
    beachbg = mult(beachbg, translate(0, 30, -28));
    beachbg = mult(beachbg, scale(50, 17, 20));
    beachbg = mult(beachbg, modelViewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(beachbg));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, beachBackgroundTexture);
    gl.drawArrays( gl.TRIANGLES, 0, 36);

    ////////////////////////////////
    // Render the sphere!
    ////////////////
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, movePosition));
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
    ////////////////////////////////

    if(time >= waterLevelTime[ waterLevelIndex ]){
        movePosition += 0.01;

        if(movePosition > 1.4){  // go to beach
            waterLevelIndex += waterLevelNext;
            prebgPos = backgroundPos;
            backgroundPos = 0;
            if(waterLevelIndex >= 3 && waterLevelNext == 1){
                waterLevelIndex = 1; 
                waterLevelNext = -1;
            }
            else if(waterLevelIndex < 0 && waterLevelNext == -1){
                onTheBeach = 1; 
                waterLevelIndex = 1; 
                waterLevelNext = 1;
                isFinalisland = 1;
            }

            movePosition = 0;
            walking = 0; //not walking
            walkForward = 0;
            walkBackward = 0;
            time = 0;//reset timer before going to different stage
        }
        modelViewMatrix = lookAt(eye, at, up);
        modelViewMatrix = mult(modelViewMatrix, translate(0, 0, movePosition));
    }

    time += timer.getElapsedTime() / 1000;

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
            cubeUV[i][1] -= 0.02;
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
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, oceanFloorBumpMap);

    gl.uniform1i(UNIFORM_usebumpmap, 1);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1i(UNIFORM_bsampler, 1);
    
    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);

    if(waterLevelIndex == 0)
        gl.drawArrays( gl.TRIANGLES, 0, 36);
    gl.uniform1i(UNIFORM_usebumpmap, 0);

    /////////////////////////
    // render ocean background
    ////////////////////
    modelViewMatrix = lookAt(eye, at, up);
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    // to make a background movement transition
    var level1High = 6;
    if(waterLevelIndex == 1 && waterLevelNext == 1)
        backgroundPos = prebgPos + level1High * time/waterLevelTime[ waterLevelIndex ];
    else if(waterLevelIndex == 2 && waterLevelNext == 1)
        backgroundPos = prebgPos;// + 2 * time/waterLevelTime[ waterLevelIndex ];
    else if(waterLevelIndex == 1 && waterLevelNext == -1)
        backgroundPos = prebgPos - level1High * time/waterLevelTime[ waterLevelIndex ];
    // else if(waterLevelIndex == 2 && waterLevelNext == -1)
        // backgroundPos = prebgPos - 2 * time/waterLevelTime[ waterLevelIndex ];

    rockWall = mat4();
    rockWall = mult(rockWall, translate(0, 30 + backgroundPos, -15));
    rockWall = mult(rockWall, scale(40, 30, 20));
    rockWall = mult(rockWall, modelViewMatrix);    

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, waterBackgroundTexture);
    gl.drawArrays( gl.TRIANGLES, 0, 36);


    ////////////////////////////////
    // Render the world rock
    ///////////////////////////////
    modelViewMatrix = lookAt(eye, at, up);

    if(waterLevelIndex != 0){
        // for left rock wall
        gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(moveNormalUV), gl.STATIC_DRAW );
        gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

        var rockWall = mat4();
        rockWall = mult(rockWall, translate(-14, 5 + backgroundPos, 5));
        rockWall = mult(rockWall, scale(1, 5, 10));
        // rockWall = mult(rockWall, rotate(30, [0, 0, 1]));
        // rockWall = mult(rockWall, rotate(270, [1, 0, 0]));
        rockWall = mult(rockWall, modelViewMatrix);   

        gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, rockTexture);

        // for bump mapping
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, wallBumpMap);

        gl.uniform1i(UNIFORM_usebumpmap, 1);
        gl.uniform1i(UNIFORM_sampler, 0);
        gl.uniform1i(UNIFORM_bsampler, 1);

        gl.drawArrays( gl.TRIANGLES, 0, 36);
        gl.uniform1i(UNIFORM_usebumpmap, 0);        

        // for right rock wall
        gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(moveNormalUV), gl.STATIC_DRAW );
        gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

        rockWall = mat4();
        rockWall = mult(rockWall, translate(14, 5 + backgroundPos, 5));
        rockWall = mult(rockWall, scale(1, 5, 10));
        // rockWall = mult(rockWall, rotate(30, [0, 0, 1]));
        // rockWall = mult(rockWall, rotate(270, [1, 0, 0]));
        rockWall = mult(rockWall, modelViewMatrix);    

        gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, rockTexture);
        gl.uniform1i(UNIFORM_usebumpmap, 1);
        gl.uniform1i(UNIFORM_sampler, 0);
        gl.uniform1i(UNIFORM_bsampler, 1);

        gl.drawArrays( gl.TRIANGLES, 0, 36);
        gl.uniform1i(UNIFORM_usebumpmap, 0);     
    }


    ////////////////////////////////
    // Render monster
    ///////
    // if(time < waterLevelTime[ waterLevelIndex ]){//transition between, no monsters
        for(var i = 0; i < monsterNumber; i++)
            createMonster(i);
    // }

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

    enableAlphaBlending();
    createBubble(7, 1, -10);
    createBubble(-3, 1, -7);
    createBubble(3, 1, -2);
    createBubble(-5, 1, -3);
    disableAlphaBlending();

    // createSwaweed(3, 0, -1);
    if(waterLevelIndex == 2)    inWave = 1;
    else                        inWave = 0;
    
    createPeople(moveLeft, 0, moveForward, onTheBeach, walkForward);

    worldViewMatrix();
}
    // print instruction on the top
    lightPosition = vec3(60, 0, -40);
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    printStr("ABABB");

    // make life points
    lightPosition = vec3(0, 10.0, 40);
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    createLifePoints(numLifePoints);

    window.requestAnimFrame( render );
}


