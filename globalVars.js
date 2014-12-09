/*
This file essentially contains most the global variables for this project.
*/

// Basic global variables that need to be created!
var canvas;
var gl;


var length = 1;
var time = 0.0;
var timer = new Timer();
var mushroomTime = 0.0;
var mushroomTimer = new Timer();
var omega = 360;


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

var theta = 0.00; // for little rotate character when turn left/right.

var distance = 1;
var fovy = 90;

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

/*	For collision detection
	each object will have a bounding box to check whether objsct collide other bounding boxes. 
*/
var bodyBox = new boundingBox();
// for monster 1 to 5
var monsterBoxes = new Array();
monsterBoxes.push(new boundingBox());
monsterBoxes.push(new boundingBox());
monsterBoxes.push(new boundingBox());
monsterBoxes.push(new boundingBox());
monsterBoxes.push(new boundingBox());
var mushroomBox = new boundingBox();
var swordCubeBox = new boundingBox();

//gender bender
var genderBender = {};
genderBender.isSet = false;
genderBender.want = null;
genderBender.is = null;