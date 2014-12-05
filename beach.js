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

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;
var oceanDeg = 0, oceanDegUnit = 0.1;
var movePosition = 0, movePositionUnit = 0.005;

var waterLevelTime = [1, 1, 1];
var waterLevelIndex = 0;
var waterLevelNext = 1;
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

if(onTheBeach == 1){
    ////////////////////////////////
    // Render the beach
    ////////

    if(walkForward == 1)
        movePosition += movePositionUnit;
    else if(walkBackward == 1 && movePosition >= 0.03)
        movePosition -= movePositionUnit;

    if(movePosition > 2.0){  
        if(isFinalisland == 1){
            movePosition = 2.0;
        }
        else{
        onTheBeach = 0; //going to underwater
        movePosition = 0;
        walking = 0;
        waterLevelIndex = 0;
        }

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

    var beachFloor = mat4();

    beachFloor = mult(beachFloor, scale(20, 0.00001, 20));
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

    /////////////////////////
    // render food
    ////////////////////////
    createFood(3, 1, -15);

    //////////////////////////
    // render final tresure
    //////////////////////////
    createMeganFox(0, 0, -25);

    //////////////////////////
    // render Texture box
    //////////////////////////
    // createTextureBox(-1, 0, -12);

    ////////////////////////////
    // render the beach floor
    ////////////////////////////
    var beachFloor = mat4();

    beachFloor = mult(beachFloor, scale(20, 0.01, 20));
    beachFloor = mult(beachFloor, translate(0,0,-1.0));
    beachFloor = mult(beachFloor, modelViewMatrix);    
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(beachFloor));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, beachOceanTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

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
    ////////
    time += timer.getElapsedTime() / 1000;

    if(time >= waterLevelTime[ waterLevelIndex ]){
        movePosition += 0.01;

        if(movePosition > 1.4){  // go to beach
            waterLevelIndex += waterLevelNext
            if(waterLevelIndex >= 3 && waterLevelNext == 1)     {waterLevelIndex = 1; waterLevelNext = -1;}
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

    if(waterLevelIndex == 0)
        gl.drawArrays( gl.TRIANGLES, 0, 36);


    ////////////////////////////////
    // Render the world rock
    ///////////////////////////////
    modelViewMatrix = lookAt(eye, at, up);
    // for left rock wall
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    if(waterLevelIndex == 1){

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
    }

    /////////////////////////
    // render ocean background
    ////////////////////
    modelViewMatrix = lookAt(eye, at, up);
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeUVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    rockWall = mat4();
    rockWall = mult(rockWall, translate(0, 30, -15));
    rockWall = mult(rockWall, scale(40, 30, 20));
    rockWall = mult(rockWall, modelViewMatrix);    

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(rockWall));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, waterBackgroundTexture);
    gl.drawArrays( gl.TRIANGLES, 0, 36);



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

    createBubble(7, 1, -10);
    createBubble(-3, 1, -7);
    createBubble(3, 1, -2);
    createBubble(-5, 1, -3);

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


