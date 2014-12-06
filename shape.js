/*

This file contains all the functions that allow for the creation of various
shapes! Note that some of the variables it affects are in the "globalVars.js"
file!

Main Author: Yao-Jen
*/

////////////////////////////////////////////////
// Function for creating a cube!
////////////////////////////////////////////////

function Cube(length, points, normals, uv, uv2) {

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

    function Quad( vertices, points, normals, uv, uv2, v1, v2, v3, v4, normal) {
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);

        var bound = 5;
        // for normal texture coordinate
        uv.push(vec2(0,0));
        uv.push(vec2(bound,0));
        uv.push(vec2(bound,bound));
        uv.push(vec2(0,0));
        uv.push(vec2(bound,bound));
        uv.push(vec2(0,bound));

        var bound2 = 1;
        // for normal texture coordinate
        uv2.push(vec2(0,0));
        uv2.push(vec2(bound2,0));
        uv2.push(vec2(bound2,bound2));
        uv2.push(vec2(0,0));
        uv2.push(vec2(bound2,bound2));
        uv2.push(vec2(0,bound2));

        // 6 points to form 2 triangels, which can combine to a
        points.push(vertices[v1]);
        points.push(vertices[v3]);
        points.push(vertices[v4]);
        points.push(vertices[v1]);
        points.push(vertices[v4]);
        points.push(vertices[v2]);
    }

    // six faces of a cube
    Quad(vertices, points, normals, uv, uv2, 0, 1, 2, 3, vec3(0, 0, 1));
    Quad(vertices, points, normals, uv, uv2, 4, 0, 6, 2, vec3(0, 1, 0));
    Quad(vertices, points, normals, uv, uv2, 4, 5, 0, 1, vec3(1, 0, 0));
    Quad(vertices, points, normals, uv, uv2, 2, 3, 6, 7, vec3(1, 0, 1));
    Quad(vertices, points, normals, uv, uv2, 6, 7, 4, 5, vec3(0, 1, 1));
    Quad(vertices, points, normals, uv, uv2, 1, 5, 3, 7, vec3(1, 1, 0));
}

////////////////////////////////////////////////
// Function for creating a sphere!
////////////////////////////////////////////////

function createSphere(numberDivisions, points, normals, uv)
{
    var va = vec3(0.0, 0.0, -1.0);
    var vb = vec3(0.0, 0.942809, 0.333333);
    var vc = vec3(-0.816497, -0.471405, 0.333333);
    var vd = vec3(0.816497, -0.471405, 0.333333);
    
    function triangle(a,b,c)
    {
        normals.push(a, b, c);
        points.push(a, b, c);

        // now the texture corrdinates are wrong and should be fixed it later
        // var disA = Math.sqrt(Math.pow((a[0] - va[0]), 2) +  Math.pow((a[1] - va[1]), 2) +  Math.pow((a[2] - va[2]), 2) );
        // var disB = Math.sqrt(Math.pow((b[0] - vb[0]), 2) +  Math.pow((b[1] - vb[1]), 2) +  Math.pow((b[2] - vb[2]), 2) );
        // var disC = Math.sqrt(Math.pow((c[0] - vc[0]), 2) +  Math.pow((c[1] - vc[1]), 2) +  Math.pow((c[2] - vc[2]), 2) );

        var bound = 1;
        uv.push(vec2(0, 0));
        uv.push(vec2(0, 0));
        uv.push(vec2(0, 0));
        sphereIndex += 3;
    }

    function divideTriangle(a, b, c, count)
    {
        if (count > 0) 
        {
            var ab = normalize(mix(a, b, 0.5), false);
            var ac = normalize(mix(a, c, 0.5), false);
            var bc = normalize(mix(b, c, 0.5), false);
            divideTriangle(a, ab, ac, count - 1);
            divideTriangle(ab, b, bc, count - 1);
            divideTriangle(bc, c, ac, count - 1);
            divideTriangle(ab, bc, ac, count - 1);
        }
        else
            triangle(a, b, c);
    }

    function tetrahedron(a, b, c, d, n)
    {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    }

    tetrahedron(va,vb,vc,vd,numberDivisions);
}

////////////////////////////////////////////////
// Function for creating bubbles!
////////////////////////////////////////////////

var upDis = -1.4, bubbleSize = 0.05, backMove = 0;
function createBubble(xvalue, yvalue, zvalue) {

    worldViewMatrix();
    
    upDis += 0.03;
    bubbleSize += 0.001;
    backMove += 0.02;

    if(upDis >= 9) {
        upDis = -1.4;
        bubbleSize = 0.05;
        backMove = 0;
    }

    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);

    ctm = mult(ctm, translate(xvalue, yvalue + upDis, zvalue + backMove));
    ctm = mult(ctm, scale(bubbleSize, bubbleSize, bubbleSize));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);

    ctm = mult(ctm, translate(xvalue, yvalue + upDis - 1, zvalue + backMove));
    ctm = mult(ctm, scale(bubbleSize - 0.05, bubbleSize - 0.05, bubbleSize - 0.05));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );       
}

var goBackPos = -9, goBackUnit = 0.1;

function createSwaweed(xvalue, yvalue, zvalue) {
    worldViewMatrix();

    goBackPos += goBackUnit;
    if(goBackPos > 12)   goBackPos = -9;

    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, rotate(-theta * 3 , [0, 1, 0]));      //wheb rotate the whole world, seaweed would rotate
    ctm = mult(ctm, translate(xvalue, yvalue + 2, zvalue + goBackPos));
    
    ctm = mult(ctm, scale(0.1, 1, 0.1));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

}

function createCelebrity(xvalue, yvalue, zvalue){
    ctm = mat4();
    ctm = mult(ctm, translate(xvalue, yvalue + 2, -5 + zvalue + movePosition * 20));
    // ctm = mult(ctm, rotate(10, [0, 1, 0]));
    ctm = mult(ctm, scale(5, 5, 0.1));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );
    
    var uvBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    celebrityTexture.image.src =  "/resource/EmmaWatson.jpg"; //"/resource/megan.png";
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, celebrityTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 6); 
}



function createTextureBox(xvalue, yvalue, zvalue){
    ctm = mat4();
    ctm = mult(ctm, translate(xvalue, yvalue + 1, zvalue + movePosition * 20));
    ctm = mult(ctm, rotate(30, [0, 1, 0]));
    ctm = mult(ctm, scale(1.5, 1, 1));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );
    
    var uvBuffer2 = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, goldenTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36); 

}


function createFood(xvalue, yvalue, zvalue){
    ctm = mat4();
    ctm = mult(ctm, translate(xvalue, yvalue + 2, zvalue + movePosition * 20));
    ctm = mult(ctm, scale(0.5, 0.5, 0.5));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );
    
    var uvBuffer2 = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, foodTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36); 

}

var monsterXpos = [];
var monsterYpos = [];
var monsterZpos = [];
var monsterSpeed = [];
var monsterSize = [];
function createMonster(monstweindex) {
    worldViewMatrix();

    if( monstweindex > (monsterXpos.length -1)){
        monsterXpos.push(0);  monsterYpos.push(0); monsterZpos.push(0);
        monsterSpeed.push(0); monsterSize.push(0);
        
        monsterXpos[ monstweindex ] = Math.random() * 16 - 8;// range from -8 ~ 8
        monsterYpos[ monstweindex ] = Math.random() * 4 + 1.5;// range from 1.5 ~ 5.5
        monsterZpos[ monstweindex ] = -15 - Math.random(); 

        monsterSpeed[ monstweindex ] = 0.15 + Math.random() / 7;
        monsterSize[ monstweindex ] = Math.random();            
    }

    monsterZpos[ monstweindex ] += monsterSpeed[ monstweindex ] ;
    if(monsterZpos[ monstweindex ] >= 5){

        monsterXpos[ monstweindex ] = Math.random() * 16 - 8;// range from -8 ~ 8
        monsterYpos[ monstweindex ] = Math.random() * 4 + 1.5;// range from 1.5 ~ 5.5
        monsterZpos[ monstweindex ] = -15 - Math.random(); 

        monsterSpeed[ monstweindex ] = 0.2 + Math.random() / 7;
        monsterSize[ monstweindex ] = Math.random();
    }

    ctm = modelViewMatrix;
    ctm = mult(ctm, translate(monsterXpos[ monstweindex ], monsterYpos[ monstweindex ], monsterZpos[ monstweindex ]));
    // ctm = mult(ctm, rotate(45, [0, 1, 0]));
    ctm = mult(ctm, rotate(5, [1, 0, 0]));
    ctm = mult(ctm, scale(monsterSize[ monstweindex ], monsterSize[ monstweindex ], monsterSize[ monstweindex ]));


    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );
    
    var uvBuffer2 = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, monsterTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36); 

}

////////////////////////////////////////////////
// Function for creating the player character!
////////////////////////////////////////////////

var deg  = 180;
var degUnit = 15;
var moveForward = 0;// for character to move forward or backward. 'W' and 'S' key
var moveLeft = 0;
var inWave = 0, inWavePos = 0, waveUnit = 0.05;// indicate if people in a wave (bouncing in x axis)

function createPeople(xPos, Ypos, Zpos, checkOnTheBeach, checkWalk) {
    worldViewMatrix();
    modelViewMatrix = mult(modelViewMatrix, rotate(theta, [0, 1, 0]));      //rotate the whole world   

    if(inWave == 1){
        inWavePos += waveUnit;
        if(inWavePos > 0.5 && waveUnit > 0)         waveUnit = -waveUnit;
        else if(inWavePos < -0.5 && waveUnit < 0)   waveUnit = -waveUnit;
        // else                                        inWave = 0; 
    }

    modelViewMatrix = mult(modelViewMatrix, translate(xPos + inWavePos, Ypos, Zpos));

    var xvalue = 0, yvalue = 3.6, zvalue = 0;

    // draw head
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue, 2 + yvalue, zvalue));
    ctm = mult(ctm, scale(0.5, 0.5, 0.5));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, oceanTexture);

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex ); 

    // draw body
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue, yvalue, zvalue));
    ctm = mult(ctm, scale(0.3, 1.5, 0.3));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   
    
    // for move the hand and foots
    deg += degUnit;
    if(deg == 240)   degUnit = -degUnit;
    else if(deg == 120) degUnit = -degUnit;

    // draw right hand
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue + 0.8, yvalue + 0.7, zvalue));
    
    if(checkOnTheBeach ==  1)       hasSword = 0;
    else                            {hasSword = 1; checkWalk = 1;}

    if(hasSword == 1)                           ctm = mult(ctm, rotate( -210, [1, 0, 0]));
    else if(hasSword == 0 && checkWalk == 1)    ctm = mult(ctm, rotate( -deg, [1, 0, 0]));
    else if(checkWalk == 0)                     ctm = mult(ctm, rotate( -120, [1, 0, 0]));

    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(-45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    // draw left hand
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue - 0.8, yvalue + 0.7, zvalue));

    if(checkWalk == 1)      ctm = mult(ctm, rotate(deg, [1, 0, 0]));
    else if(checkWalk == 0) ctm = mult(ctm, rotate(240, [1, 0, 0]));
    
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    // draw right foot
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue + 0.6, yvalue - 1.5, zvalue));

    if(checkWalk == 1)          ctm = mult(ctm, rotate(deg, [1, 0, 0]));
    else if(checkWalk == 0)     ctm = mult(ctm, rotate(240, [1, 0, 0]));

    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(-45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));


    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    // draw left foot
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue - 0.6, yvalue - 1.5, zvalue));
    
    if(checkWalk == 1)          ctm = mult(ctm, rotate(-deg, [1, 0, 0]));
    else if(checkWalk == 0)     ctm = mult(ctm, rotate(-120, [1, 0, 0]));

    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

}

function createSword(xPos, Ypos, Zpos, xRotate){
    worldViewMatrix();
    modelViewMatrix = mult(modelViewMatrix, rotate(theta, [0, 1, 0]));      //rotate the whole world   

    modelViewMatrix = mult(modelViewMatrix, translate(xPos + inWavePos, Ypos, Zpos));
    modelViewMatrix = mult(modelViewMatrix, rotate(xRotate, [1, 0, 0]));
    
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
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    var handle = modelViewMatrix
    // handle = mult(handle, rotate( -deg, [0, 1, 0]));

    handle = mult(handle, translate(0, 1.5, 0));
    handle = mult(handle, rotate(45, [0, 1, 0]));
    handle = mult(handle, scale(0.07, 0.2, 0.07));
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(handle));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, silverTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    var handle = modelViewMatrix
    // handle = mult(handle, rotate( -deg, [0, 1, 0]));

    handle = mult(handle, translate(0, 1.7 ,0));
    handle = mult(handle, rotate(45, [1, 0, 0]));
    handle = mult(handle, scale(0.4, 0.06, 0.06));
    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(handle));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, silverTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36);

    // for sword
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
    gl.bindTexture(gl.TEXTURE_2D, goldenTexture);

    ctm = modelViewMatrix;
    // ctm = mult(ctm, rotate( -deg, [0, 1, 0]));

    ctm = mult(ctm, translate(0, 2.8, 0));
    ctm = mult(ctm, scale(0.1, 1.2, 0.1));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );  
}

////////////////
// use orthogonal projection
////////////////
var numLifePoints = 1;
function createLifePoints(num){
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

    var uvBuffer2 = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lifePointTexture);

    for(var i = 0; i < num; i++){
        ctm = mat4();
        ctm = mult(ctm, translate(-3.5 + i * 0.5, 3.8, 0));
        ctm = mult(ctm, scale(0.2, 0.2, 0.2));

        gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

        gl.drawArrays( gl.TRIANGLES, 0, 6); 
    }
}