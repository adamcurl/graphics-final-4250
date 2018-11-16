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

// bow point positions
var bowStartPoint = 0;
var bowEndPoint = 0;

// to keep track of point positions
var boxPointEnd = 0;
var bowPointEnd = 0;
var wrapPointEnd = 0;
var prismPointEnd = 0;

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

// vertices
var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0, 0, 1), //8
  vec4(0.5, 0, 0, 1), //9
  vec4(0.25, 1.01, 1.01, 1), // top-left-front 10
  vec4(0.25, -0.01, 1.01, 1), // btm-left-front 11
  vec4(0.75, -0.01, 1.01, 1), // btm-right-front 12
  vec4(0.75, 1.01, 1.01, 1), // top-right-front 13
  vec4(0.25, 1.01, -0.01, 1), // top-left-back 14
  vec4(0.75, 1.01, -0.01, 1), // top-right-back 15
  vec4(0.25, -0.01, -0.01, 1), // btm-left-back 16
  vec4(0.75, -0.01, -0.01, 1), // btm-right-back 17
  vec4(0, 0.5, 0, 1), // 18
  vec4(-0.5, 0, 1, 1), // 19
  vec4(0.5, 0, 1, 1), // 20
  vec4(0, 0.5, 1, 1) // 21
];

/********** GENERATE FUNCTIONS **********/
function GenerateBowPoints() {
  var Radius = 0.4;
  var numPoints = 80;
  bowStartPoint = vertices.length;
  // generate first side of bow
  for (var i = 0; i < numPoints; i++) {
    var Angle = i * ((2.0 * Math.PI) / numPoints);
    var X = Math.cos(Angle) * Radius;
    var Y = Math.sin(Angle) * Radius;
    vertices.push(vec4(X, Y, 0, 1));
  }
  // generate other side of bow
  for (var i = 0; i < numPoints; i++) {
    var Angle = i * ((2.0 * Math.PI) / numPoints);
    var X = Math.cos(Angle) * Radius;
    var Y = Math.sin(Angle) * Radius;
    vertices.push(vec4(X, Y, 0.5, 1));
  }
  bowEndPoint = vertices.length - 1;
}

/********** QUAD FUNCTIONS **********/
function QuadPrism() {
  quad(21, 20, 9, 18);
  quad(18, 8, 19, 21);
  quad(19, 8, 9, 20);
  tri(21, 19, 20);
  tri(18, 9, 8);
  prismPointEnd = numVertices;
}
function QuadPresentBow() {
  for (var i = bowStartPoint; i < bowStartPoint + 79; i++) {
    var a = i;
    var b = 80 + i;
    var c = 81 + i;
    var d = i + 1;
    quad(d, c, b, a);
  }
  // connect bow
  quad(bowStartPoint, bowStartPoint + 80, bowEndPoint, bowStartPoint + 79);
  bowPointEnd = numVertices;
}

// draw shapes
function QuadPresentBox() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
  boxPointEnd = numVertices;
}

function QuadPresentWrap() {
  quad(10, 11, 12, 13);
  quad(14, 10, 13, 15);
  quad(15, 17, 16, 14);
  quad(11, 16, 17, 12);
  wrapPointEnd = numVertices;
}

/********** DRAW FUNCTIONS **********/
function DrawSolidCube(length) {
  modelViewStack.push(modelViewMatrix);
  s = scale4(length, length, length); // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, boxPointEnd);

  modelViewMatrix = modelViewStack.pop();
}

function DrawWall(thickness) {
  var s, t;

  // draw thin wall with top = xz-plane, corner at origin
  modelViewStack.push(modelViewMatrix);

  t = translate(0.5, 0.5 * thickness, 0.5);
  s = scale4(1.0, thickness, 1.0);
  modelViewMatrix = mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);

  modelViewMatrix = modelViewStack.pop();
}

function DrawPresentBox() {
  gl.drawArrays(gl.TRIANGLES, 0, boxPointEnd);
}

function DrawPresentBow() {
  // draw right side of bow
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0.3, 0.72, -0.2));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.8, 0.4, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, boxPointEnd, bowPointEnd - boxPointEnd);
  modelViewMatrix = modelViewStack.pop();
  // draw left side of bow
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-0.3, 0.72, -0.2));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.8, 0.4, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, boxPointEnd, bowPointEnd - boxPointEnd);
  modelViewMatrix = modelViewStack.pop();
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function DrawPresentWrap() {
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-0.5, -0.5, -0.5));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, bowPointEnd, wrapPointEnd - bowPointEnd);
  modelViewMatrix = modelViewStack.pop();
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // rotate and draw other wrap side
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, translate(-0.5, -0.5, -0.5));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, bowPointEnd, wrapPointEnd - bowPointEnd);
  modelViewMatrix = modelViewStack.pop();
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function DrawPrism() {
  gl.drawArrays(gl.TRIANGLES, wrapPointEnd, prismPointEnd - wrapPointEnd);
}

function DrawPresent() {
  // red box
  materialAmbient = vec4(1, 0.1, 0.1, 1.0);
  materialDiffuse = vec4(1, 0.1, 0.1, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  DrawSolidCube(1);
  // green bow and wrap
  materialAmbient = vec4(0.1, 0.7, 0.1, 1.0);
  materialDiffuse = vec4(0.1, 0.7, 0.1, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  DrawPresentBow();
  DrawPresentWrap();
}

function DrawHouse() {
  // draw house body
  materialAmbient = vec4(1, 0.7, 0.5, 1.0);
  materialDiffuse = vec4(1, 0.7, 0.5, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(2, 1.02, 3));
  modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 3));
  DrawSolidCube(1);
  modelViewMatrix = modelViewStack.pop();
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(2, 2.02, 1.5));
  modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 3));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawPrism();
  modelViewMatrix = modelViewStack.pop();

  // draw roof
  materialAmbient = vec4(1, 0, 0, 1.0);
  materialDiffuse = vec4(1, 0, 0, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(1.3, 2.35, 3));
  modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
  modelViewMatrix = mult(modelViewMatrix, scale4(2.0, 0.02, 3.0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix = modelViewStack.pop();
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(2.7, 2.35, 3));
  modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 0, 1));
  modelViewMatrix = mult(modelViewMatrix, scale4(2.0, 0.02, 3.0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix = modelViewStack.pop();

  // draw door
  materialAmbient = vec4(0.6, 0.4, 0.2, 1.0);
  materialDiffuse = vec4(0.6, 0.4, 0.2, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(1.5, 0.02, 4.55));
  modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1.0, 0.0, 0.0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, 2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();

  // draw window
  materialAmbient = vec4(1, 1, 1, 1.0);
  materialDiffuse = vec4(1, 1, 1, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(3.01, 0.5, 2));
  modelViewMatrix = mult(modelViewMatrix, rotate(90.0, 0.0, 0.0, 1.0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, 2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();
}

function DrawEnvironment() {
  materialAmbient = vec4(0.1, 0.1, 0.6, 1.0);
  materialDiffuse = vec4(0.1, 0.1, 0.6, 1.0);
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  // wall # 1: in xz-plane
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, scale4(7, 1, 7));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();

  // wall #2: in yz-plane
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, rotate(90.0, 0.0, 0.0, 1.0));
  modelViewMatrix = mult(modelViewMatrix, scale4(4, 1, 7));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();

  // wall #3: in xy-plane
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1.0, 0.0, 0.0));
  modelViewMatrix = mult(modelViewMatrix, scale4(7, 1, 4));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();
}

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

/********** SUPPORTING FUNCTIONS **********/
function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

function quad(a, b, c, d) {
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  normal = normalize(normal);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  pointsArray.push(vertices[d]);
  normalsArray.push(normal);

  numVertices += 6;
}

function tri(a, b, c) {
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  normal = normalize(normal);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);

  numVertices += 5;
}
