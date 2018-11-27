// Project 4 by Adam Curl
var canvas;
var gl;
var program;
var animating = false;
var lights = false;

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
var lightPosition = vec4(-1, 6, 8, 0.0);
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

// variable for drawing the unit sphere
var cubeCount = 36;
var sphereCount = 0;
var numTimesToSubdivide = 5;

//animation
var makeItSnow = false;
var count = 0;
var snowArray = [
  vec3(2, 9, 1),
  vec3(2, 7, 3),
  vec3(3, 6.5, 1),
  vec3(2, 7, 4),
  vec3(4, 10, 3),
  vec3(6, 9, 5),
  vec3(4, 8, 5),
  vec3(5, 8, 3),
  vec3(9, 10, 2),
  vec3(5, 9, 3),
  vec3(3, 9, 2),
  vec3(4, 8, 3),
  vec3(2, 6.5, 2),
  vec3(6, 10, 1),
  vec3(1, 9, 2),
  vec3(2, 8, 2),
  vec3(1, 10, 2),
  vec3(3, 9, 1),
  vec3(5, 8, 9),
  vec3(9, 9, 1),
  vec3(2, 10, 4),
  vec3(1, 11, 5),
  vec3(4, 8, 3),
  vec3(3, 10, 2),
  vec3(9, 9, 6),
  vec3(5, 9, 3),
  vec3(2, 11, 3),
  vec3(5, 8, 2),
  vec3(3, 11, 6),
  vec3(6, 9, 1)
];

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

  // coordinates of the initial points of the tetrahedron for drawing the unit sphere
  var va = vec4(0.0, 0.0, -1.0, 1);
  var vb = vec4(0.0, 0.942809, 0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
  var vd = vec4(0.816497, -0.471405, 0.333333, 1);
  tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
  spherePointsEnd = numVertices;

  QuadMailBox();
  MailPostPoints();

  GenerateNose(0.08, 0.45);
  GenerateTreePoints();
  GenerateStar();

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
    render();
  };
  document.getElementById("phiMinus").onclick = function() {
    phi -= deg;
    render();
  };
  document.getElementById("thetaPlus").onclick = function() {
    theta += deg;
    render();
  };
  document.getElementById("thetaMinus").onclick = function() {
    theta -= deg;
    render();
  };
  document.getElementById("zoomIn").onclick = function() {
    zoomFactor *= 0.95;
    render();
  };
  document.getElementById("zoomOut").onclick = function() {
    zoomFactor *= 1.05;
    render();
  };
  document.getElementById("left").onclick = function() {
    translateFactorX -= 0.1;
    render();
  };
  document.getElementById("right").onclick = function() {
    translateFactorX += 0.1;
    render();
  };
  document.getElementById("up").onclick = function() {
    translateFactorY += 0.1;
    render();
  };
  document.getElementById("down").onclick = function() {
    translateFactorY -= 0.1;
    render();
  };

  // If you press 'a', start or end animation.
  /*document.addEventListener("keypress", function(e) {
    if (e.keyCode == 97) {
      animating = !animating;
      makeItSnow = true;
      //count = 0;
      render();
    }
  });*/

  window.onkeydown = HandleKeyboard;
  render();
};


// If you press 'a', start or end animation.
function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 65: 
              if (makeItSnow) {
              makeItSnow = false;
               }
               if(animating){
                 animating=false;
               }
              
              else {        
              makeItSnow=true;
              animating=true;
              lights=true;
              count = 0;
              }
              
              break;
    }
}


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
  modelViewMatrix = mult(modelViewMatrix, translate(6, 0.25, 1));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 0.5));
  DrawPresent();
  modelViewMatrix = modelViewStack.pop();

  // draw house
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-0.4, 0, -1));
  DrawHouse();
  modelViewMatrix = modelViewStack.pop();

  // draw snowman
  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(2, 0.5, 6);
  modelViewMatrix = mult(modelViewMatrix, t); //move
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSnowmanBody(); //draw snowman body
  modelViewMatrix = modelViewStack.pop(); //POP

  // draw mailbox
  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(3, 2, 3);
  s = scale4(0.4, 0.4, 0.4);
  modelViewMatrix = mult(mult(modelViewMatrix, t), s); //shrink and move
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawMailBoxHead(); //draw mailbox head
  DrawMailPost(); //draw mailbox post
  DrawMailFlag();
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(1, -0.2, 6.05);
  modelViewMatrix = mult(modelViewMatrix, t); //move
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawNose(); //draw snowman nose
  DrawFace(); //draw the snowmans eyes and mouth
  modelViewMatrix = modelViewStack.pop(); //POP

  // draw tree
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(4.5, 0.5, 1.5));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.2, 3, 1.2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawTree();
  modelViewMatrix = modelViewStack.pop(); //POP

  // draw tree trunk
  changeColor(0.6, 0.6, 0);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(4.5, 0.5, 1.5));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.4, 1, 0.4));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix = modelViewStack.pop(); //POP

  //draw star
  modelViewStack.push(modelViewMatrix); //PUSH
  r = rotate(90, 1, 0, 0);
  t = translate(4.2, 1.5, -3);
  modelViewMatrix = mult(modelViewMatrix, r);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawStar();
  modelViewMatrix = modelViewStack.pop(); //POP

  // draw lights, lights animation checkpoint
  if (animating) {
    if (lights) {
      DrawAlphaLights();
    } else {
      DrawBetaLights();
    }
    lights = !lights;
  } else {
    DrawAlphaLights();
    DrawBetaLights();
  }
//snow animation checkpoint
   if (makeItSnow) {
     var steps = 250;
     var stepSize = 50 / steps;

     if (count <= steps) {
       modelViewStack.push(modelViewMatrix); //PUSH
       t = translate(0, stepSize * (1 - count), 0);
       modelViewMatrix = mult(modelViewMatrix, t);
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       DrawSnow();
       modelViewMatrix = modelViewStack.pop(); //POP

       count++;
       
     } else {
       count = 0;
     }
   } else {
     // draw snow
     modelViewStack.push(modelViewMatrix); //PUSH
     t = translate(0.45, 0.4, 0.45);
     modelViewMatrix = mult(modelViewMatrix, t);
     gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
     DrawSnow();
     modelViewMatrix = modelViewStack.pop(); //POP
   }
requestAnimFrame(render);
};