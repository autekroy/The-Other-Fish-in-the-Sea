/*

This file contains all the functions that allow for the creation of various
shapes which are living.
Some of the variables it affects are in the "globalVars.js" file.

Main Author: Yao-Jen Chang
*/

var fishXpos = [];
var fishYpos = [];
var fishZpos = [];
var fishSpeed = [];
var fishSize = [];
function createFish(monstweindex) {
    worldViewMatrix();

    if( monstweindex > (fishXpos.length -1)){
        fishXpos.push(0);  fishYpos.push(0); fishZpos.push(0);
        fishSpeed.push(0); fishSize.push(0);
        
        fishXpos[ monstweindex ] = Math.random() * 16 - 8;// range from -8 ~ 8
        fishYpos[ monstweindex ] = Math.random() * 4 + 1.5;// range from 1.5 ~ 5.5
        fishZpos[ monstweindex ] = -15 - Math.random(); 

        fishSpeed[ monstweindex ] = 0.15 + Math.random() / 7;
        fishSize[ monstweindex ] = Math.random() * 0.1 + 0.1;            
    }

    fishZpos[ monstweindex ] += fishSpeed[ monstweindex ] ;
    if(fishZpos[ monstweindex ] >= 5){

        fishXpos[ monstweindex ] = Math.random() * 16 - 8;// range from -8 ~ 8
        fishYpos[ monstweindex ] = Math.random() * 4 + 1.5;// range from 1.5 ~ 5.5
        fishZpos[ monstweindex ] = -15 - Math.random(); 

        fishSpeed[ monstweindex ] = 0.2 + Math.random() / 7;
        fishSize[ monstweindex ] = Math.random();
    }

    ctm = modelViewMatrix;
    ctm = mult(ctm, translate(fishXpos[ monstweindex ], fishYpos[ monstweindex ], fishZpos[ monstweindex ]));
    // ctm = mult(ctm, rotate(45, [0, 1, 0]));
    ctm = mult(ctm, rotate(5, [1, 0, 0]));
    ctm = mult(ctm, scale(fishSize[ monstweindex ], fishSize[ monstweindex ], 1.5 * fishSize[ monstweindex ]));


    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );
    
    var uvBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fishTexture);

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


    putExtremesInBoundaryObject(cubePoints, ctm, monsterBoxes[ monstweindex ]);

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
    
    putExtremesInBoundaryObject(spherePoints, ctm, bodyBox);//for collision

    // for move the hands and foots
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


var mushroomXpos = -0.6;
var mushroomYpos = 3;
var mushroomZpos = -15;
var mushroomSpeed = 0.3;
var mushroomSize = 0.3;
// var mushroomStartTime, mushroomEndTime;

function createMushroom() {
    if(mushroomZpos >= 6){
        return;// on chance to eat mushroom
    }
    else if(mushroomZpos == -15){
        mushroomTimer.reset();
        transparentStatus = 1;
    }

    worldViewMatrix(); 

    mushroomZpos += mushroomSpeed;

    ctm = modelViewMatrix;
    ctm = mult(ctm, translate(mushroomXpos, mushroomYpos, mushroomZpos));
    ctm = mult(ctm, rotate(15, [1, 0, 0]));
    ctm = mult(ctm, scale(mushroomSize, mushroomSize, mushroomSize));


    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );
    
    var uvBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stableUV), gl.STATIC_DRAW );      //uv data
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer2 );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mushroomTexture);

    gl.drawArrays( gl.TRIANGLES, 0, 36); 

    // for collision
    putExtremesInBoundaryObject(cubePoints, ctm, mushroomBox);
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


