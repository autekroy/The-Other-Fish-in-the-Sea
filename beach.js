/*

This file contains the init() and render() functions!

Main Autohr: Yao-Jen Chang
Collision detection: Sergio
Picking: Michael
Bump Mapping: Katie
Blending: Brandon

*/

var program;
var notPickUp = [1, 1, 1]; // To decide whether to draw the fruit box or not

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

    // define different texture. (texture.js)
    defineTexture();
    defineBumpMappingTexture();
    defineAlphabetTexture();
    defineMonsterTexture();

    // Process Shaders (or something like that)
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

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

    //Detect mouse down
    canvas.addEventListener("mousedown", function() {
        //Bind FBO instead of the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        //Draw the fruit box in the FBO
        eye = vec3(0, 1 * distance, 1.8 * distance);

        modelViewMatrix = lookAt(eye, at, up);

        projectionMatrix = perspective(fieldOfView, aspectRatio, 0.001, 1000);
        projectionMatrix = mult(projectionMatrix, translate(0,-2,-4));

        gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(modelViewMatrix));
        modelViewMatrix = mult(modelViewMatrix, translate(0, 0, movePosition));

        gl.uniform1i(gl.getUniformLocation(program, "colorSelector"), 1);//To set up i = 1 -> corresponding to fragment shader
        if (notPickUp[0] == 1) {
            createFood(-2.5, -1.5, 0);
        }

        gl.uniform1i(gl.getUniformLocation(program, "colorSelector"), 2);
        if (notPickUp[1] == 1) {
            createFood(-2.4, -1, -1);
        }
        // gl.uniform1i(gl.getUniformLocation(program, "colorSelector"), 3);
        // if (notPickUp[2] == 1) {
        //     createFood(-1.5, 0, 0);        
        // }
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
            "Second Treasure Box Full of Fruit!",
            "Green Cube",
            "Third Treasure Box Full of Sushi!",
            "magenta",
            "Blue Cube",
            "White Cube"
        ];
        //To know what is picked
        var nameIndex = 0;
        if (color[0] == 255) nameIndex += 1;
        if (color[1] == 255) nameIndex += 2;
        if (color[2] == 255) nameIndex += 4;
        if (nameIndex == 1 && onTheBeach == 1) {
            // alert("You just picked up a " + colorNames[nameIndex]);
            notPickUp[0] = 0;
            numLifePoints++;
        }
        if (nameIndex == 2 && onTheBeach == 1) {
            // alert("You just picked up a " + colorNames[nameIndex]);
            notPickUp[1] = 0;
            numLifePoints++;
        }
        // if (nameIndex == 4) {
        //     alert("You just picked up a " + colorNames[nameIndex]);
        //     notPickUp[2] = 0;
        //     numLifePoints++;
        // }

        //Bind everything back to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.uniform1i(gl.getUniformLocation(program, "colorSelector"), 0);//Set colorSelector back to 0 (fColor)
        gl.clear(gl.COLOR_BUFFER_BIT);

    });
    
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

var islandIndex = 0; // the island index
var finalLisland = 2; // the last island
var congraMessage = 0;

var waterLevelTime = [1, 5, 5];
var waterLevelIndex = 0;
var waterLevelNext = 1;

var backgroundPos = 0, prebgPos = 0;
var transparentStatus = 0;

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 1 * distance, 1.8 * distance);

    modelViewMatrix = lookAt(eye, at, up);

    projectionMatrix = perspective(fieldOfView, aspectRatio, 0.001, 1000);
    projectionMatrix = mult(projectionMatrix, translate(0,-2,-4));

    gl.uniformMatrix4fv(UNIFORM_projectionMatrix, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(UNIFORM_viewMatrix, false, flatten(modelViewMatrix));

    lightPosition = vec3(0, 70.0, 20);
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

        if(islandIndex == finalLisland && movePosition >= 1){
            movePosition = 1;
            // alert("You're in the last!");
        }
        else if(movePosition > 2.0){  
            onTheBeach = 0; //going to underwater
            movePosition = 0;
            walking = 0;
            waterLevelIndex = 0;
            waterLevelNext = 1;
            timer.reset(); // reset timer before going to underwater
        }
        else{
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

            beachFloor = mult(beachFloor, scale(20, 0.00001, 15));
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
            if (islandIndex != finalLisland && notPickUp[0] == 1)  createFood(-2.5, -1.5, 0);
            if (islandIndex != finalLisland && notPickUp[1] == 1)  createFood(-2.4, -1, -1);

            //////////////////////////
            // render final tresure
            //////////////////////////
            if(islandIndex > 0)
                createCelebrity(0, 0, -25, islandIndex);

            //////////////////////////
            // render Texture box
            //////////////////////////
            // createTextureBox(-1, 0, -12);

            ////////////////////////////
            // render the beach ocean floor
            ////////////////////////////
            var beachFloor = mat4();

            beachFloor = mult(beachFloor, scale(20, 0.01, 15));
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
    }
    else{ // underwater scene
        ////////////////////////////////
        // Render the Ocean Floor!
        ////////////////////////////////

        if(time >= waterLevelTime[ waterLevelIndex ]){
            movePosition += 0.01;

            if(movePosition > 1.4){  // go to beach
                waterLevelIndex += waterLevelNext;
                prebgPos = backgroundPos;

                movePosition = 0;
                walking = 0; //not walking
                walkForward = 0;
                walkBackward = 0;
                time = 0;//reset timer before going to different stage

                backgroundPos = 0;
                if(waterLevelIndex >= 3 && waterLevelNext == 1){
                    waterLevelIndex = 1; 
                    waterLevelNext = -1;
                }
                else if(waterLevelIndex < 0 && waterLevelNext == -1){
                    timer.reset();
                    mushroomPass = false;
                    mushroomTime = 0;
                    mushroomZpos = -15;
                    onTheBeach = 1; 
                    waterLevelIndex = 0;///////////check 
                    waterLevelNext = 1;
                    islandIndex++;
                }
            }
            modelViewMatrix = lookAt(eye, at, up);
            modelViewMatrix = mult(modelViewMatrix, translate(0, 0, movePosition));
        }

        if(onTheBeach != 1){ // check if on the beach incase above codes!
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
                // scrolling the cube (beach)
                if(textureScroll == 1){
                    for(var i = 0; i < 36; i++){
                        moveNormalUV[i][0] -= 0.001;
                        // moveNormalUV[i][0] -= textureLeft/100;
                        // reset all the texture coordinate incase they are too low to get overflow.
                        if(moveNormalUV[i][1] <= -1000000){
                            for(var j = 0; j < 36; j++)
                                moveNormalUV[j][1] += 10;
                        }
                    }
                }

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

                gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(moveNormalUV), gl.STATIC_DRAW );
                gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

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
                rockWall = mult(rockWall, translate(14, backgroundPos - 5, 5));
                
                // rockWall = mult(rockWall, rotate(30, [0, 0, 1]));
                rockWall = mult(rockWall, rotate(180, [0, 0, 1]));
                rockWall = mult(rockWall, scale(1, 5, 10)); 
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

            /////////////////////
            // Mushroom for undefeated status
            /////////////////////
            if(waterLevelIndex == 2 && !mushroomPass){
                createMushroom();
            }

            if(transparentStatus == 1){
                mushroomTime += mushroomTimer.getElapsedTime() / 1000;
                if(mushroomTime >= 2)   transparentStatus = 0;
            }



            ////////////////////////////////
            // Render monster
            ////////////////////////////////
            for(var i = 0; i < monsterNumber + islandIndex; i++)// islandIndex is from 0 to 1
                createMonster(i);

            ///////////////////////
            // Render fished
            ////////////////////////
            for(var i = 0; i < 2; i++)
                createFish(i);

            ////////////////////////////////
            // Render sword
            ////////
            if(transparentStatus == 1){
                enableAlphaBlending();
                createSword(1.3 + moveLeft, 2.1, -1.3 + moveForward, 0);
                disableAlphaBlending();
            }
            else
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

            // set alpha to make bubble more real
            enableAlphaBlending();
            createBubble(7, 1, -10);
            createBubble(-3, 1, -7);
            createBubble(3, 1, -2);
            createBubble(-5, 1, -3);
            disableAlphaBlending();

            // // createSwaweed(3, 0, -1);

            if(waterLevelIndex == 2)    inWave = 1;
            else                        inWave = 0;

            // Render person
            if(transparentStatus == 1){
                enableAlphaBlending();    
                createPeople(moveLeft, 0, moveForward, onTheBeach, walkForward);
                disableAlphaBlending();
            }
            else
                createPeople(moveLeft, 0, moveForward, onTheBeach, walkForward);
            
            // check collision between person and monsters
            var hasCollisionHappened;
            if(transparentStatus != 1){
                hasCollisionHappened = false;
                // var checkForCollision = true;
                for(var i = 0; i < 4; i++){   
                    // if(checkForCollision){
                        hasCollisionHappened =  bodyBox.haveCollided(monsterBoxes[i]);
                        if(hasCollisionHappened){
                            numLifePoints --;
                            hasCollisionHappened = false;
                            // checkForCollision = false;
                            monsterZpos[i] = 6;
                            break;
                        }
                    // }
                }
            }

            // check collision betwen person and mashroom
            var hasMushroomCollisionHappened = false;
            hasMushroomCollisionHappened =  bodyBox.haveCollided(mushroomBox);
            if(hasMushroomCollisionHappened){
                mushroomTimer.reset();
                transparentStatus = 1;
                mushroomZpos = 6;
            }

            worldViewMatrix();
        }// end of checking if on the beach

    }// end of underwater

    // print instruction on the top
    // lightPosition = vec3(10, 40, 80);
    // gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    // printStr("B");

    // make life points
    lightPosition = vec3(0, 10.0, 40);
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    createLifePoints(numLifePoints);

    // check if game over
    if(numLifePoints < 0){
        numLifePoints = 3;
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, gameOverTexture);

    //     ctm = mat4();
    //     ctm = mult(ctm, translate(0, 2, 0));
    //     ctm = mult(ctm, scale(1.3, 1.3, 1.3));
    //     gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    //     gl.drawArrays( gl.TRIANGLES, 0, 6);      

    //     // alert("GAME OVER!");
    //     return;
    }

    window.requestAnimFrame( render );
}


