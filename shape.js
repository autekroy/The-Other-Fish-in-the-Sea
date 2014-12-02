/*

This file contains all the functions that allow for the creation of various
shapes! Note that some of the variables it affects are in the "globalVars.js"
file!

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

        var bound = 8;
        // for normal texture coordinate
        uv.push(vec2(0,0));
        uv.push(vec2(bound,0));
        uv.push(vec2(bound,bound));
        uv.push(vec2(0,0));
        uv.push(vec2(bound,bound));
        uv.push(vec2(0,bound));

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

////////////////////////////////////////////////
// Function for creating the player character!
////////////////////////////////////////////////

var deg  = 180;
var degUnit = 15;
var moveForward = 0;// for character to move forward or backward. 'W' and 'S' key
function createPeople(xPos, Ypos, Zpos) {
    worldViewMatrix();

    modelViewMatrix = mult(modelViewMatrix, translate(xPos, Ypos, Zpos));

    var xvalue = 0, yvalue = 3.6, zvalue = 0;
    // materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    // materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
    // materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    // shininess = 100.0;

    // ambientProduct = mult(lightAmbient, materialAmbient);
    // diffuseProduct = mult(lightDiffuse, materialDiffuse);
    // specularProduct = mult(lightSpecular, materialSpecular);

    // gl.uniform4fv( UNIFORM_lightPosition,  flatten(lightPosition) );
    // gl.uniform4fv( UNIFORM_ambientProduct, flatten(ambientProduct) );
    // gl.uniform4fv( UNIFORM_diffuseProduct, flatten(diffuseProduct) );
    // gl.uniform4fv( UNIFORM_specularProduct,flatten(specularProduct) );   
    // gl.uniform1f( UNIFORM_shininess ,shininess );

    // draw head
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue, 2 + yvalue, zvalue));
    ctm = mult(ctm, scale(0.5, 0.5, 0.5));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

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
    ctm = mult(ctm, rotate( -deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(-45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    // draw left hand
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue - 0.8, yvalue + 0.7, zvalue));
    ctm = mult(ctm, rotate(deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    // draw right foot
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue + 0.6, yvalue - 1.5, zvalue));
    ctm = mult(ctm, rotate(deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(-45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));


    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

    // draw left foot
    ctm = modelViewMatrix;
    ctm = mult(ctm, rotate(-30, [1, 0, 0]));
    ctm = mult(ctm, translate(xvalue - 0.6, yvalue - 1.5, zvalue));
    ctm = mult(ctm, rotate( -deg, [1, 0, 0]));
    ctm = mult(ctm, translate(0, 0.5, 0));
    ctm = mult(ctm, rotate(45, [0, 0, 1]));
    ctm = mult(ctm, scale(0.2, 0.8, 0.2));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   

}
