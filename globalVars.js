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
var omega = 360;

var numTimesToSubdivide = 1;

// Points and Normals for shapes!
var cubePoints = [];
var cubeNormals = [];
var cubeUV = [];
var uv2 = [];
var spherePoints = [];
var sphereNormals = [];
var sphereUV = [];

// Buffers for shapes!
var cubePositionBuffer;
var cubeNormalBuffer;
var cubeUVBuffer;

var spherePositionBuffer;
var sphereNormalBuffer;
var sphereUVBuffer;

// Variables related to textures!
var myTexture;
var BubbleTexture;
var rockTexture;

// Variables related to the camera and viewport!
var viewMatrix;
var modelViewMatrix;
var projectionMatrix;

var fieldOfView = 60;
var aspectRatio = 16.0/9.0;

var eye = vec3(0, 1, 1.8);
var at = vec3(0, 1, 0);
var up = vec3(0, 1, 0);

// Variables related to lighting!
var shininess = 50;
var lightPosition = vec3(5.0, 20.0, 0.0);

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


var theta = 0.01;

var distance = 1;
var fovy = 90;

// for naviggation system
var unit = 2;
var altitude = 0;
var theta = 1.5;

// sphere
var sphereIndex = 0;

