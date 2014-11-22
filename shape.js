/*

This file contains all the functions that allow for the creation of various
shapes! Note that some of the variables it affects are in the "globalVars.js"
file!

*/

// Function for creating a cube!
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

        var bound = 20;
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

// Function for creating a sphere!
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
        var bound = 1;
        uv.push(vec2(bound, bound));
        uv.push(vec2(bound, 0));
        uv.push(vec2(0, bound));
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


var upDis = 0, bubbleSize = 0.2;
function createBubble(xvalue, yvalue, zvalue) {

    worldViewMatrix();
    
    upDis += 0.03;
    bubbleSize += 0.001;

    if(upDis >= 4){
        upDis = 0;
        bubbleSize = 0.1;
    }

    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);

    ctm = mult(ctm, translate(xvalue, yvalue + upDis, zvalue));
    ctm = mult(ctm, scale(bubbleSize, bubbleSize, bubbleSize));

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm) );

    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );   
}
