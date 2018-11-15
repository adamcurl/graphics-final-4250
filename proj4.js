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
var lightPosition = vec4(1.8, 1, 2, 0.0);
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

// to keep track of point positions
var bowStartPoint = 0;
var bowEndPoint = 0;
var boxPointEnd = 0;
var bowPointEnd = 0;
var wrapPointEnd = 0;

//	"camera" variables
var zoomFactor = 3.0;
var translateFactorX = -0.75;
var translateFactorY = -0.25;
var phi = 30; // camera rotating angles
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
  // box points
  vec4(0, 0, 0, 1), // A(0)
  vec4(1, 0, 0, 1), // B(1)
  vec4(1, 1, 0, 1), // C(2)
  vec4(0.5, 1.5, 0, 1), // D(3)
  vec4(0, 1, 0, 1), // E(4)
  vec4(0, 0, 1, 1), // F(5)
  vec4(1, 0, 1, 1), // G(6)
  vec4(1, 1, 1, 1), // H(7)
  vec4(0.5, 1.5, 1, 1), // I(8)
  vec4(0, 1, 1, 1), // J(9)
  vec4(0.25, 1.01, 1.01, 1), // top-left-front 10
  vec4(0.25, -0.01, 1.01, 1), // btm-left-front 11
  vec4(0.75, -0.01, 1.01, 1), // btm-right-front 12
  vec4(0.75, 1.01, 1.01, 1), // top-right-front 13
  vec4(0.25, 1.01, -0.01, 1), // top-left-back 14
  vec4(0.75, 1.01, -0.01, 1), // top-right-back 15
  vec4(0.25, -0.01, -0.01, 1), // btm-left-back 16
  vec4(0.75, -0.01, -0.01, 1) // btm-right-back 17
];

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

function GenerateBowPoints() {
  var Radius = 0.5;
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
  console.log("bowpointend", bowPointEnd);
}

// draw shapes
function QuadPresentBox() {
  quad(0, 5, 9, 4); // AFJE left side
  quad(1, 2, 7, 6); // BCHG right side
  quad(0, 1, 6, 5); // ABGF bottom
  quad(5, 6, 7, 9); // FGHJ front
  quad(0, 4, 2, 1); // AECB back
  quad(4, 9, 7, 2); // FJHC top
  boxPointEnd = numVertices;
  console.log("boxpointend", boxPointEnd);
}

function QuadPresentWrap() {
  quad(10, 11, 12, 13);
  quad(14, 10, 13, 15);
  quad(15, 17, 16, 14);
  quad(11, 16, 17, 12);
  wrapPointEnd = numVertices;
  console.log("wrappointend", wrapPointEnd);
}

function DrawPresentBox() {
  // change color of object
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
  gl.drawArrays(gl.TRIANGLES, 0, boxPointEnd);
}

function DrawPresentBow() {
  // change color of object
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
  // draw right side of bow
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0.9, 1.22, 0.3));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.8, 0.4, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, boxPointEnd, bowPointEnd - boxPointEnd);
  modelViewMatrix = modelViewStack.pop();
  // draw left side of bow
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0.1, 1.22, 0.3));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.8, 0.4, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, boxPointEnd, bowPointEnd - boxPointEnd);
  modelViewMatrix = modelViewStack.pop();
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function DrawPresentWrap() {
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
  gl.drawArrays(gl.TRIANGLES, bowPointEnd, wrapPointEnd - bowPointEnd);

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0.5, 0.5, 0.5));
  modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, translate(-0.5, -0.5, -0.5));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, bowPointEnd, wrapPointEnd - bowPointEnd);
  modelViewMatrix = modelViewStack.pop();
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
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

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  GenerateBowPoints();

  // draw mesh items
  QuadPresentBox();

  QuadPresentBow();

  QuadPresentWrap();

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

  // support user interface
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

  DrawPresentBox();
  DrawPresentBow();
  DrawPresentWrap();

  requestAnimFrame(render);
};
