//global variables
var canvas;
var gl;
var len = 0.5;
var deg = 0.0;
var fColor;
var viewMatrix;
var projectionMatrix;
var points;
var n_w = 90;
var vBuffer;
var vPosition;
//for translating the squares
var nav_vector_sideways = vec3(0.0,0.0,0.0);
var nav_vector_z_way = vec3(0.0,0.0,0.0);
var nav_vector_sideways_just_green = vec3(0.0,0.0,0.0);
var nav_vector_vertical = vec3(0.0,0.0,0.0);

//parameters for the lookAt function, to place the camera so that it can see all the cubes
var eye = vec3(0.0,0.0, 10.0);
var at = vec3(0.0,0.0,0.0);
var up = vec3(0.0,2.0,0.0);

//this array will hold all 2 colors available to the 2 cubes
var colors = new Array();
var red = vec4(1.0,0.0,0.0,1.0);
var green = vec4(0.0,1.0,0.0,1.0);

//push all the colors to the colors array
colors.push(red);
colors.push(green);

//parameters for the ortho function
var l = -1;
var r = 1;
var t = 1;
var b = -1;
var n = -1;
var f = 1;


//points that start the spheres
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
var numTimesToSubdivide = 5;
var index = 0;
var pointsArray = [];
var normalsArray = [];

function triangle(a, b, c) {


     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);
    
     // normals are vectors
     
     normalsArray.push(a[0],a[1], a[2]);
     normalsArray.push(b[0],b[1], b[2]);
     normalsArray.push(c[0],c[1], c[2]);

     index += 3; 
}

function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

//when the page loads

window.onload = function init()
{
    //grab the canvas from the DOM, set it up with WebGL
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); } //report failure to start WebGL if failure

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //these are the eight points that will be the vertices of the cube
    vertices = [
        vec3(  len,   len, len ), //vertex 0
        vec3(  len,  -len, len ), //vertex 1
        vec3( -len,   len, len ), //vertex 2
        vec3( -len,  -len, len ),  //vertex 3
        vec3(  len,   len, -len ), //vertex 4
        vec3(  len,  -len, -len ), //vertex 5
        vec3( -len,   len, -len ), //vertex 6
        vec3( -len,  -len, -len )  //vertex 7
    ];

    //In order to form the cube using gl.TRIANGLE_STRIP for extra credit, the vertices need to be pushed into the points array in this order
    points = [];
    points.push(vertices[4]);
    points.push(vertices[5]);
    points.push(vertices[6]);
    points.push(vertices[7]);
    points.push(vertices[3]);
    points.push(vertices[5]);
    points.push(vertices[1]);
    points.push(vertices[0]);
    points.push(vertices[3]);
    points.push(vertices[2]);
    points.push(vertices[6]);
    points.push(vertices[0]);
    points.push(vertices[4]);
    points.push(vertices[5]);

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" ); //initialize the shaders
    gl.useProgram( program );

    vBuffer = gl.createBuffer(); //make and bind to a buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );  //set up variable for assigning vertex positions
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor"); //make variable for giving the color

    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix"); //make variable for modelViewMatrix

    viewMatrix = lookAt(eye, at, up); //set camera position and orientation
    projectionMatrix = perspective(n_w, 1, -1, 2); //set perspective projection
    //render
    render();

}

//for moving the camera to look side to side
var rotateWorldY = 0;
var translate_cube_red = vec3( -3.0, 0.0, 5.0);
var translate_cube_green = vec3(-1.0, 0.0, 5.0);
var translate_sphere_blue = vec3(3.0, 0.0, 5.0);
//this is the array of the previously mentioned variables 

function matrixPointMultiplication(matrix, point)
{
    var pointMatrix = new Array();
    var result = new Array(matrix.length);
    for(var pointVectorRow = 0; pointVectorRow < point.length; pointVectorRow++)
    {
        var tempArray = [point[pointVectorRow]];
        pointMatrix.push(tempArray);
    }

    var result = new Array(matrix.length);

    for(var matrixRow = 0; matrixRow < matrix.length; matrixRow++)
    {
        result[matrixRow] = new Array(pointMatrix[0].length);
    }


    if(matrix[0].length != pointMatrix.length)
    {
        console.log("the matrix and the point are not good... dimension wise");
        return;
    }
    else
    {
        for(var matrixRow = 0; matrixRow < matrix.length; matrixRow++)
        {
            for(var pointMatrixColumn = 0; pointMatrixColumn < pointMatrix[0].length; pointMatrixColumn++)
            {
                result[matrixRow][pointMatrixColumn] = 0.0;
                for(var matrixColumn = 0; matrixColumn < matrix[0].length; matrixColumn++)
                {
                    result[matrixRow][pointMatrixColumn] += matrix[matrixRow][matrixColumn] * pointMatrix[matrixColumn][pointMatrixColumn];
                }
            }
        }
    }

    return result;
}

function putExtremesInBoundaryObject(arrayOfPoints, ctm, boundaryObject)
{
    var minX = {};
    var minY = {};
    var minZ = {};
    var maxX = {};
    var maxY = {};
    var maxZ = {};

    var firstTime = true;

    for(var i = 0; i < arrayOfPoints.length; i++)
    {
        var current_point = vec4(arrayOfPoints[i][0],arrayOfPoints[i][1],arrayOfPoints[i][2],1.0);
        var transformed_point =  matrixPointMultiplication(ctm, current_point);//mult(current_point, ctm);
        if(firstTime)
        {
            minX.transformed_point = transformed_point[0][0];
            minX.point = current_point[0];
            minY.transformed_point = transformed_point[1][0];
            minY.point = current_point[1];
            minZ.transformed_point = transformed_point[2][0];
            minZ.point = current_point[2];
            maxX.transformed_point = transformed_point[0][0];
            maxX.point = current_point[0];
            maxY.transformed_point = transformed_point[1][0];
            maxY.point = current_point[1];
            maxZ.transformed_point = transformed_point[2][0];
            maxZ.point = current_point[2];

            firstTime = false;
        }
        else
        {
            //look for minX
            if(transformed_point[0] < minX.transformed_point)
            {
                minX.transformed_point = transformed_point[0][0];
                minX.point = current_point[0];
            }
            //look for minY
            if(transformed_point[1] < minY.transformed_point)
            {
                minY.transformed_point = transformed_point[1][0];
                minY.point = current_point[1];
            }
            //look for minZ
            if(transformed_point[2] < minZ.transformed_point)
            {
                minZ.transformed_point = transformed_point[2][0];
                minZ.point = current_point[2];
            }
            //look for maxX
            if(transformed_point[0] > maxX.transformed_point)
            {
                maxX.transformed_point = transformed_point[0][0];
                maxX.point = current_point[0];
            }
            //look for maxY
            if(transformed_point[1] > maxY.transformed_point)
            {
                maxY.transformed_point = transformed_point[1][0];
                maxY.point = current_point[1]; 
            }
            //look for maxZ
            if(transformed_point[2] > maxZ.transformed_point)
            {
                maxZ.transformed_point = transformed_point[2][0];
                maxZ.point = current_point[2];                
            }
        }   
    }

    boundaryObject.setminX(minX);
    boundaryObject.setminY(minY);
    boundaryObject.setminZ(minZ);
    boundaryObject.setmaxX(maxX);
    boundaryObject.setmaxY(maxY);
    boundaryObject.setmaxZ(maxZ);
}

var green_cube_boundary_box = new boundingBox();
var red_cube_boundary_box = new boundingBox();
var blue_sphere_boundary_box = new boundingBox();
var translate_cube_2 = vec3(-2.0, 0.0, 5.0);
function render()
{
    //clear the buffer so we can draw something new 
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //draw the cube in the top right furthest to the back
    //(taking into account that the later the code appears the earlier it will take effect)
    //create an identity matrix
    var ctm = mat4();
    //translate the cube sideways depending on value of nav_vector_sideways
    ctm = mult(ctm, translate(nav_vector_sideways));
    //translate the cube vertically depending on the value of nav_vector_vertical
    ctm = mult(ctm, translate(nav_vector_vertical));
    //apply the projection matrix
    ctm = mult(ctm, projectionMatrix);
    //translate the cube towards or away from the camera according to nav_vector_z_way
    ctm = mult(ctm, translate(nav_vector_z_way));
    //translate the cube to its +-10,+-10,+-10 position
    ctm = mult(ctm, translate(translate_cube_red));
    //apply the view matrix to translate to cam coordinates
    ctm = mult(ctm, viewMatrix);
    //apple the model view matrix
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
    //apply the color based on what the colors_index_array says cube #0 is supposed to get
    gl.uniform4fv(fColor, flatten(colors[0]));
    // gl.drawArrays( gl.TRIANGLES, 0, 36 );
    //draw the cube usng triangle strip
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 14);

    putExtremesInBoundaryObject(points, ctm, red_cube_boundary_box);

    //draw the cube in the top left furthest to the back
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    ctm = mat4();
    ctm = mult(ctm, translate(nav_vector_sideways));
    ctm = mult(ctm, translate(nav_vector_sideways_just_green));
    ctm = mult(ctm, translate(nav_vector_vertical));
    ctm = mult(ctm, projectionMatrix);
    ctm = mult(ctm, translate(nav_vector_z_way));
    ctm = mult(ctm, translate(translate_cube_green));
    ctm = mult(ctm, viewMatrix);
    gl.uniform4fv(fColor, flatten(colors[1]));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
    // gl.drawArrays( gl.TRIANGLES, 0, 36 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 14);

    // firstTime = true;

    // for(var i = 0; i < points.length; i++)
    // {
    //     var current_point = vec4(points[i][0],points[i][1],points[i][2],1.0);
    //     var transformed_point =  matrixPointMultiplication(ctm, current_point);//mult(current_point, ctm);
    //     if(firstTime)
    //     {
    //         minX.transformed_point = transformed_point[0][0];
    //         minX.point = current_point[0];
    //         minY.transformed_point = transformed_point[1][0];
    //         minY.point = current_point[1];
    //         minZ.transformed_point = transformed_point[2][0];
    //         minZ.point = current_point[2];
    //         maxX.transformed_point = transformed_point[0][0];
    //         maxX.point = current_point[0];
    //         maxY.transformed_point = transformed_point[1][0];
    //         maxY.point = current_point[1];
    //         maxZ.transformed_point = transformed_point[2][0];
    //         maxZ.point = current_point[2];

    //         firstTime = false;
    //     }
    //     else
    //     {
    //         //look for minX
    //         if(transformed_point[0] < minX.transformed_point)
    //         {
    //             minX.transformed_point = transformed_point[0][0];
    //             minX.point = current_point[0];
    //         }
    //         //look for minY
    //         if(transformed_point[1] < minY.transformed_point)
    //         {
    //             minY.transformed_point = transformed_point[1][0];
    //             minY.point = current_point[1];
    //         }
    //         //look for minZ
    //         if(transformed_point[2] < minZ.transformed_point)
    //         {
    //             minZ.transformed_point = transformed_point[2][0];
    //             minZ.point = current_point[2];
    //         }
    //         //look for maxX
    //         if(transformed_point[0] > maxX.transformed_point)
    //         {
    //             maxX.transformed_point = transformed_point[0][0];
    //             maxX.point = current_point[0];
    //         }
    //         //look for maxY
    //         if(transformed_point[1] > maxY.transformed_point)
    //         {
    //             maxY.transformed_point = transformed_point[1][0];
    //             maxY.point = current_point[1]; 
    //         }
    //         //look for maxZ
    //         if(transformed_point[2] > maxZ.transformed_point)
    //         {
    //             maxZ.transformed_point = transformed_point[2][0];
    //             maxZ.point = current_point[2];                
    //         }
    //     }   
    // }

    // green_cube_boundary_box.setminX(minX);
    // green_cube_boundary_box.setminY(minY);
    // green_cube_boundary_box.setminZ(minZ);
    // green_cube_boundary_box.setmaxX(maxX);
    // green_cube_boundary_box.setmaxY(maxY);
    // green_cube_boundary_box.setmaxZ(maxZ);
    putExtremesInBoundaryObject(points, ctm, green_cube_boundary_box);
    var collided = false;
    collided = green_cube_boundary_box.haveCollided(red_cube_boundary_box);

    if(collided)
    {
        setTimeout(function(){ alert("You're FUCKED!"); },50);
        return null;
    }
    
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer(  vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    ctm = mat4();
    ctm = mult(ctm, translate(nav_vector_sideways));
    ctm = mult(ctm, translate(nav_vector_vertical));
    ctm = mult(ctm, projectionMatrix);
    ctm = mult(ctm, translate(nav_vector_z_way));
    // ctm = mult(ctm, translate(vec3(0.0,0.0,-4.0)));
    ctm = mult(ctm, translate(translate_sphere_blue));
    ctm = mult(ctm, viewMatrix);
    ctm = mult(ctm, scale([0.7,0.7,0.7]));
    gl.uniform4fv(fColor, flatten(vec4(0.0,0.0,1.0,1.0)));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));

    for( var i=0; i<index; i+=3) 
    {    gl.drawArrays( gl.TRIANGLES, i, 3 ); }

    // firstTime = true;

    // for(var i = 0; i < pointsArray.length; i++)
    // {
    //     var current_point = vec4(pointsArray[i][0],pointsArray[i][1],pointsArray[i][2],1.0);
    //     var transformed_point =  matrixPointMultiplication(ctm, current_point);//mult(current_point, ctm);
    //     if(firstTime)
    //     {
    //         minX.transformed_point = transformed_point[0][0];
    //         minX.point = current_point[0];
    //         minY.transformed_point = transformed_point[1][0];
    //         minY.point = current_point[1];
    //         minZ.transformed_point = transformed_point[2][0];
    //         minZ.point = current_point[2];
    //         maxX.transformed_point = transformed_point[0][0];
    //         maxX.point = current_point[0];
    //         maxY.transformed_point = transformed_point[1][0];
    //         maxY.point = current_point[1];
    //         maxZ.transformed_point = transformed_point[2][0];
    //         maxZ.point = current_point[2];

    //         firstTime = false;
    //     }
    //     else
    //     {
    //         //look for minX
    //         if(transformed_point[0] < minX.transformed_point)
    //         {
    //             minX.transformed_point = transformed_point[0][0];
    //             minX.point = current_point[0];
    //         }
    //         //look for minY
    //         if(transformed_point[1] < minY.transformed_point)
    //         {
    //             minY.transformed_point = transformed_point[1][0];
    //             minY.point = current_point[1];
    //         }
    //         //look for minZ
    //         if(transformed_point[2] < minZ.transformed_point)
    //         {
    //             minZ.transformed_point = transformed_point[2][0];
    //             minZ.point = current_point[2];
    //         }
    //         //look for maxX
    //         if(transformed_point[0] > maxX.transformed_point)
    //         {
    //             maxX.transformed_point = transformed_point[0][0];
    //             maxX.point = current_point[0];
    //         }
    //         //look for maxY
    //         if(transformed_point[1] > maxY.transformed_point)
    //         {
    //             maxY.transformed_point = transformed_point[1][0];
    //             maxY.point = current_point[1]; 
    //         }
    //         //look for maxZ
    //         if(transformed_point[2] > maxZ.transformed_point)
    //         {
    //             maxZ.transformed_point = transformed_point[2][0];
    //             maxZ.point = current_point[2];                
    //         }
    //     }   
    // }


    // blue_sphere_boundary_box.setminX(minX);
    // blue_sphere_boundary_box.setminY(minY);
    // blue_sphere_boundary_box.setminZ(minZ);
    // blue_sphere_boundary_box.setmaxX(maxX);
    // blue_sphere_boundary_box.setmaxY(maxY);
    // blue_sphere_boundary_box.setmaxZ(maxZ);
    putExtremesInBoundaryObject(pointsArray, ctm, blue_sphere_boundary_box);

    var collided2 = false;
    collided2 = green_cube_boundary_box.haveCollided(blue_sphere_boundary_box);
    if(collided2)
    {
        setTimeout(function(){ alert("You're FUCKED! Blue Sphere..."); },50);
        return null;
    }


    requestAnimFrame(render);
}




window.onkeydown = function(e) 
{
    var key = String.fromCharCode(e.keyCode); //store the character that the user just produced 
    switch(key)
    {
        case 'V':
        case 'v':
            //if the user hits I, then increase the translation vector in the z direction
            nav_vector_sideways_just_green[0] -= 0.025; 
            break;
        case 'N':
        case 'n':
            //if the user hits I, then increase the translation vector in the z direction
            nav_vector_sideways_just_green[0] += 0.025; 
            break;
        case 'B':
        case 'b':
            //if the user hits I, then increase the translation vector in the z direction
            nav_vector_sideways_just_green[2] += 0.25; 
            break;
        case 'G':
        case 'g':
            //if the user hits I, then increase the translation vector in the z direction
            nav_vector_sideways_just_green[2] -= 0.25; 
            break;
        case 'I':
        case 'i':
            //if the user hits I, then increase the translation vector in the z direction
            nav_vector_z_way[2] += 0.25; 
            break;
        case 'K':
        case 'k':
            //if the user hits K, then increase the translation vector in the x direction
            nav_vector_sideways[0] += 0.025;
            break;
        case 'J':
        case 'j':
            //if the user hits j, then decrease the translation vector in the x direction
            nav_vector_sideways[0] -= 0.025;
            break;
        case 'M':
        case 'm':
            //if the user hits M, then move backward by decreasing the vector in the z direction
            nav_vector_z_way[2] -=0.25;
            break;
        case "&":
            //if the user hits the up arrow decrease the vecor that controls y axis movement
            //rotateWorldX += 1;
            nav_vector_vertical[1] -= .05;
            break;
        case "(":
            //if the user hits the down arrow increase the vecor that controls y axis movement
            //rotateWorldX -= 1;
            nav_vector_vertical[1] += .05;
            break;
        case 'R':
        case 'r':
            //if the user hits R, reset all the variables and parameters to their original states
            colors_indexes_array[0] = color_index_0;
            colors_indexes_array[1] = color_index_1;
            colors_indexes_array[2] = color_index_2;
            colors_indexes_array[3] = color_index_3;
            colors_indexes_array[4] = color_index_4;
            colors_indexes_array[5] = color_index_5;
            colors_indexes_array[6] = color_index_6;
            colors_indexes_array[7] = color_index_7;
             translate_cube_0 = vec3( 10.0, 10.0,-10.0);
             translate_cube_1 = vec3(-10.0, 10.0,-10.0);
             translate_cube_2 = vec3( 10.0,-10.0,-10.0);
             translate_cube_3 = vec3(-10.0,-10.0,-10.0);
             translate_cube_4 = vec3( 10.0, 10.0, 10.0);
             translate_cube_5 = vec3(-10.0, 10.0, 10.0);
             translate_cube_6 = vec3( 10.0,-10.0, 10.0);
             translate_cube_7 = vec3(-10.0,-10.0, 10.0);
             nav_vector_sideways = vec3(0.0,0.0,0.0);
             nav_vector_z_way = vec3(0.0,0.0,0.0);
             nav_vector_vertical = vec3(0.0,0.0,0.0);
             rotateWorldX = 0;
             rotateWorldY = 0;
             n_w = 90;
             projectionMatrix = perspective(n_w, 1, -1, 2);
            break;
    }
};






























