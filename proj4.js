// Project 4 by Adam Curl
var canvas;
var gl;
var program;

// vertices and points
var numVertices = 0;
var pointsArray = [];
var normalsArray = [];

// matrices
var modelViewMatrix = mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack = [];

// Light
var lightPosition = vec4(4, 5, 2, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

// Material
var materialAmbient = vec4(1.0, 0.1, 0.1, 1.0);
var materialDiffuse = vec4(1.0, 0.1, 0.1, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 50.0;

// color
var ctm;
var ambientColor, diffuseColor, specularColor;

//	"camera" variables
var zoomFactor = 5.0;
var translateFactorX = -1.3;
var translateFactorY = 0;
var phi = 60; // camera rotating angles
var theta = 20;
var Radius = 1.5; // radius of the camera

// camera
var eye = [1, 1, 1];
var at = [0, 0, 0];
var up = [0, 1, 0];

//	Orthographics projection variables
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg = 5;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.7, 0.7, 0.7, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // generate points
  GenerateBowPoints();

  // compute item points - the order in which they are computed matters
  QuadPresentBox();
  QuadPresentBow();
  QuadPresentWrap();
  QuadPrism();
  // QuadMailBox();
  // MailPostPoints();

  // #region setup
  // Buffers
  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // set up matrices
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

  // Light
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
  // #endregion

  // #region support user interface
  document.getElementById("phiPlus").onclick = function() {
    phi += deg;
  };
  document.getElementById("phiMinus").onclick = function() {
    phi -= deg;
  };
  document.getElementById("thetaPlus").onclick = function() {
    theta += deg;
  };
  document.getElementById("thetaMinus").onclick = function() {
    theta -= deg;
  };
  document.getElementById("zoomIn").onclick = function() {
    zoomFactor *= 0.95;
  };
  document.getElementById("zoomOut").onclick = function() {
    zoomFactor *= 1.05;
  };
  document.getElementById("left").onclick = function() {
    translateFactorX -= 0.1;
  };
  document.getElementById("right").onclick = function() {
    translateFactorX += 0.1;
  };
  document.getElementById("up").onclick = function() {
    translateFactorY += 0.1;
  };
  document.getElementById("down").onclick = function() {
    translateFactorY -= 0.1;
  };
  // #endregion

  render();
};

var render = function() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set up view and projection
  projectionMatrix = ortho(
    left * zoomFactor - translateFactorX,
    right * zoomFactor - translateFactorX,
    bottom * zoomFactor - translateFactorY,
    ytop * zoomFactor - translateFactorY,
    near,
    far
  );

  eye = vec3(
    Radius *
      Math.cos((theta * Math.PI) / 180.0) *
      Math.cos((phi * Math.PI) / 180.0),
    Radius * Math.sin((theta * Math.PI) / 180.0),
    Radius *
      Math.cos((theta * Math.PI) / 180.0) *
      Math.sin((phi * Math.PI) / 180.0)
  );

  modelViewMatrix = lookAt(eye, at, up);

  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // draw walls
  DrawEnvironment();

  // draw present
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(5, 0.25, 1));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 0.5));
  DrawPresent();
  modelViewMatrix = modelViewStack.pop();

  // draw house
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-0.4, 0, -1));
  DrawHouse();
  modelViewMatrix = modelViewStack.pop();

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  requestAnimFrame(render);
};
