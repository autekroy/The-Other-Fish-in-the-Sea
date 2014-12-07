/*

This file essentially contains all the global variables that our project uses!

*/

// Basic global variables that need to be created!
var canvas;
var gl;

// Other global variables!
var length = 1;
var time = 0.0;
var timer = new Timer();
var mushroomTime = 0.0;
var mushroomTimer = new Timer();
var omega = 360;

var numTimesToSubdivide = 1;

// Points and Normals for shapes!
var cubePoints = []; //position of cube information
var cubeNormals = [];
var cubeUV = [];
var stableUV = [], moveNormalUV = [];
var spherePoints = []; // position of sphere
var sphereNormals = [];
var sphereUV = [];

// Buffers for shapes!
var cubePositionBuffer;
var cubeNormalBuffer;
var cubeUVBuffer;

var spherePositionBuffer;
var sphereNormalBuffer;
var sphereUVBuffer;

// Variables related to the camera and viewport!
var modelViewMatrix;
var projectionMatrix;

var fieldOfView = 60;
var aspectRatio = 16.0/9.0;

var eye = vec3(0, 1, 1.8);
var at = vec3(0, 1, 0);
var up = vec3(0, 1, 0);

// Variables related to lighting!
var shininess = 50;
var lightPosition = vec3(0, 50.0, 40);

var lightAmbient = vec4(0.4, 0.4, 0.4, 1.0);
var materialAmbient = vec4(0.9, 0.9, 0.9, 1.0);
var ambientProduct = mult(lightAmbient, materialAmbient);

var lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);

var lightSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var specularProduct = mult(lightSpecular, materialSpecular);

// Variables to pass into the shaders!
var UNIFORM_viewMatrix;
var UNIFORM_modelViewMatrix;
var UNIFORM_projectionMatrix;

var ATTRIBUTE_position;
var ATTRIBUTE_normal;
var ATTRIBUTE_uv;

var UNIFORM_ambientProduct;
var UNIFORM_diffuseProduct;
var UNIFORM_specularProduct;
var UNIFORM_lightPosition;
var UNIFORM_shininess;

var ifRotate = 0; // control  the rotation of both cubes.
var textureRotate = 0; // start and stop the rotation of the texture maps on all faces of the first cube
var textureScroll = 1; // start and stop the continuous scrolling the texture map on the second cube

var theta = 0.00;

var distance = 1;
var fovy = 90;

// for orthographics projection
var l = -1;
var r = 1;
var t = 1;
var b = -1;
var n = -1;
var f = 1;

// for naviggation system
var unit = 3;
var altitude = 0;
var theta = 1.5;

// sphere
var sphereIndex = 0;

// check if on The Beach
var onTheBeach = 1;
var walkForward = 0, walkBackward = 0;
var walking = 0;

// monster variable
var monsterNumber = 3; //initial number of monster


// collision detection
var bodyBox = new boundingBox();
var monsterBoxes = new Array();
monsterBoxes.push(new boundingBox());
monsterBoxes.push(new boundingBox());
monsterBoxes.push(new boundingBox());
monsterBoxes.push(new boundingBox());
var mushroomBox = new boundingBox();
var swordCubeBox = new boundingBox();