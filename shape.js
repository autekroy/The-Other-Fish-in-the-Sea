
function Cube(vertices, points, normals, uv, uv2){
    // six faces of a cube
    Quad(vertices, points, normals, uv, uv2, 0, 1, 2, 3, vec3(0, 0, 1));
    Quad(vertices, points, normals, uv, uv2, 4, 0, 6, 2, vec3(0, 1, 0));
    Quad(vertices, points, normals, uv, uv2, 4, 5, 0, 1, vec3(1, 0, 0));
    Quad(vertices, points, normals, uv, uv2, 2, 3, 6, 7, vec3(1, 0, 1));
    Quad(vertices, points, normals, uv, uv2, 6, 7, 4, 5, vec3(0, 1, 1));
    Quad(vertices, points, normals, uv, uv2, 1, 5, 3, 7, vec3(1, 1, 0));
}

function Quad( vertices, points, normals, uv, uv2, v1, v2, v3, v4, normal){

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


// sphere
var index = 0;


var bubbleUv = [];


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

function triangle(a, b, c) {

     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t1, t2));
     normal = vec4(normal);

     normals.push(normal);
     normals.push(normal);
     normals.push(normal);

    var bound = 1;
    bubbleUv.push(vec2(bound, bound));
    bubbleUv.push(vec2(bound, 0));
    bubbleUv.push(vec2(0, bound));
     
     points.push(a);
     points.push(b);      
     points.push(c);

     index += 3;
}
