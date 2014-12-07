/*

This file contains all the functions that allow for the creation of various
shapes which are not living.
Some of the variables it affects are in the "globalVars.js" file

Main Author: Yao-Jen Chang
*/

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