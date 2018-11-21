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

//matrix operations
var s,t,r;

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
var boxPointEnd = 0;
var postPointEnd=0;
var spherePointsEnd=0;
var hatPointEnd=0;
var nosePointEnd=540; //((stacks-1)*6+3)*slices

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

// variable for drawing the unit sphere
var cubeCount=36;
var sphereCount=0;
var numTimesToSubdivide = 5;

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
  // mailbox top points
  vec4(0, 0, 0, 1), // A(0)
  vec4(1, 0, 0, 1), // B(1)
  vec4(1, 1, 0, 1), // C(2)
  vec4(0, 1, 0, 1), // D(3)
  vec4(0, 0, 2, 1), // E(4)
  vec4(1, 0, 2, 1), // F(5)
  vec4(1, 1, 2, 1), // G(6)
  vec4(0, 1, 2, 1), // H(7)
//post points
  vec4(0, 0, 0, 1),      // I(8)
  vec4(.5, 0, 0, 1),    // J(9)
  vec4(.5, .75, 0, 1),  // K(10)
  vec4(0.25, 1, 0, 1), // L(11)
  vec4(0, .75, 0, 1),  // M(12)
  vec4(0, 0, 5, 1),    // N(13)
  vec4(.5, 0, 5, 1),   // O(14)
  vec4(.5, .75, 5, 1),  // P(15)
  vec4(0.25, 1, 5, 1),  // Q(16)
  vec4(0, .75, 5, 1),   // R(17)

  
  /*vec4(0,0,0,1), // S (18)
  vec4(1,0,0,1), // T (19)
  vec4(1,3,0,1), // U (20)
  vec4(0,3,0,1), // X (23)
  vec4(0,0,.5,1), // Y (24)
  vec4(1,0,.5,1), // Z (25)
  vec4(1,3,.5,1), // AA (26)
  vec4(0,3,.5,1), // BA (27)*/
  
  ];




// draw shapes
function QuadMailBox() {
  quad(0,4,7,3); // AEHD
  quad(1,2,6,5); // BCGF
  quad(0,1,5,4); // ABFE
  quad(3,2,6,7); // DCGH
  quad(4,5,6,7); // EFGH
  quad(0,1,2,3); // ABCD

  boxPointEnd = numVertices;
  console.log("boxpointend", boxPointEnd); //total number of points for mailbox top
}

function MailPostPoints(){
quad(8, 13, 17, 12);   // INRM  
quad(11, 12, 17, 16);   // LMRQ  
quad(10, 11, 16, 15);   //KLQP
quad(9, 10, 15, 14);   //JKPO
quad(8, 9, 14, 13);   //IJON
pentagon (13, 14, 15, 16, 17);  //NOPQR
pentagon (8, 12, 11, 10, 9);  // IMLKJ 


 postPointEnd=numVertices-boxPointEnd;
 console.log("postpointend", postPointEnd); //total number of points for post

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

function quadAlt(a, b, c, d) 
{
	var points=[a, b, c, d];
   	var normal = Newell(points);

        // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(b);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);

        // triangle acd
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);
   	pointsArray.push(d);
   	normalsArray.push(normal);
}

function Newell(verts)
{
   var L=verts.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=i;
       nextIndex = (i+1)%L;
       
       x += (verts[index][1] - verts[nextIndex][1])*
            (verts[index][2] + verts[nextIndex][2]);
       y += (verts[index][2] - verts[nextIndex][2])*
            (verts[index][0] + verts[nextIndex][0]);
       z += (verts[index][0] - verts[nextIndex][0])*
            (verts[index][1] + verts[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}
function pentagon(a, b, c, d, e) {

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

    pointsArray.push(vertices[a]);  
    normalsArray.push(normal); 
    pointsArray.push(vertices[d]); 
    normalsArray.push(normal); 
    pointsArray.push(vertices[e]); 
    normalsArray.push(normal);  
    
    numVertices+=9;
}
function triangle(a, b, c) 
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);


     sphereCount += 3;
}
// a, b, c, and d are all vec4 type
function triangleAlt(a, b, c) 
{
	var points=[a, b, c];
   	var normal = Newell(points);
   	
        // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
   	pointsArray.push(b);
   	normalsArray.push(normal);
   	pointsArray.push(c);
   	normalsArray.push(normal);
} 

function divideTriangle(a, b, c, count) 
{
    if ( count > 0 ) 
    {
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
/*function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }
   return (normalize(vec3(x, y, z)));
}*/


function GenerateNose(radius, height)
{
    //var hypotenuse=Math.sqrt(height*height + radius*radius);
    var stacks=8;
    var slices=12;
    // starting out with a single line in xy-plane
	var line=[];
        var segmentX = radius/stacks;
        var segmentY = height/stacks;
	for (var p=0; p<=stacks; p++)  {
	    line.push(vec4(p*segmentX, p*segmentY, 0, 1));
    }

    prev = line;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // triangle bottom of the cone
        triangleAlt(prev[1], prev[0], curr[1]);

        // create the triangles for this slice
        for (var j=1; j<stacks; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            //quad(prev1, curr1, curr2, prev2);
            quadAlt(prev2, prev1, curr1, curr2);
        }

        prev = curr;
    }
}
function DrawSnowmanBody()
{
    materialAmbient = vec4(1,1,1,1);
    materialDiffuse = vec4(1,1,1,1);
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

    modelViewStack.push(modelViewMatrix);  //PUSH
    DrawSolidSphere(0.6);
    modelViewMatrix  = modelViewStack.pop();  //POP


    modelViewStack.push(modelViewMatrix);  //PUSH
	t=translate(0, .9, 0); 
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.5);
    modelViewMatrix  = modelViewStack.pop();  //POP


    modelViewStack.push(modelViewMatrix);  //PUSH
	t=translate(0, 1.6,0);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidSphere(0.4);  
	modelViewMatrix  = modelViewStack.pop();  //POP
}


function DrawSolidSphere(radius)
{
    modelViewStack.push(modelViewMatrix);  //PUSH
	var s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
       gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
       gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES,i, 3 );
            spherePointsEnd=i;
        modelViewMatrix  = modelViewStack.pop();  //POP

}
function DrawMailBoxHead() {
    // change color of object
    materialAmbient = vec4(.1, .1, .1, 1.0);
    materialDiffuse = vec4(.1, .1, .1, 1.0);
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
  
    modelViewStack.push(modelViewMatrix);  //PUSH
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0)); 
    gl.drawArrays(gl.TRIANGLES, sphereCount, boxPointEnd);
    modelViewMatrix  = modelViewStack.pop();  //POP
  
  }
  
  function DrawMailFlag() {
    // change color of object
    materialAmbient = vec4(1, .1, .1, 1.0);
    materialDiffuse = vec4(1, .1, .1, 1.0);
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
  
    modelViewStack.push(modelViewMatrix);  //PUSH
     modelViewMatrix = mult(modelViewMatrix, translate(1, .7, 1.1)); 
     modelViewMatrix = mult(modelViewMatrix, scale4(.009, .2, .3)); 
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, sphereCount, boxPointEnd);
    modelViewMatrix  = modelViewStack.pop();  //POP

    modelViewStack.push(modelViewMatrix);  //PUSH
     modelViewMatrix = mult(modelViewMatrix, translate(1, .6, 1.1)); 
     modelViewMatrix = mult(modelViewMatrix, scale4(.009, .3, .1)); 
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, sphereCount, boxPointEnd);
    modelViewMatrix  = modelViewStack.pop();  //POP
  
  }
  function DrawMailPost() {
      // change color of object
      materialAmbient = vec4(1, 0.5, 0.3, 1.0);
      materialDiffuse = vec4(1, 0.5, 0.3, 1.0);
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
  
      modelViewStack.push(modelViewMatrix);  //PUSH
      modelViewMatrix=mult(modelViewMatrix, rotate(90, 1, 0, 0 )); //flip post on bottom of box
      modelViewMatrix = mult(modelViewMatrix, translate(.25, .5, 0)); //move and put the post in the middle
  
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
      console.log("postpointend",postPointEnd);
  
      gl.drawArrays(gl.TRIANGLES, spherePointsEnd+boxPointEnd, postPointEnd);
      modelViewMatrix  = modelViewStack.pop();  //POP
  
      
    }
function DrawNose()
{
  // change color of object
  materialAmbient = vec4(1, 0.5, 0, 1.0);
  materialDiffuse = vec4(1, 0.5, 0, 1.0);
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
  
  
    modelViewStack.push(modelViewMatrix); //PUSH
    modelViewMatrix=mult(mult(modelViewMatrix,translate(1., 2.45, .9)), rotate(-90, 1, 0, 0 )); //flip nose and put on head
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix)); 
    gl.drawArrays(gl.TRIANGLES, spherePointsEnd+boxPointEnd+postPointEnd, nosePointEnd);
    modelViewMatrix=modelViewStack.pop(); //POP

}

function DrawFace()
{
    // change color of object
  materialAmbient = vec4(0,0,0,1);
  materialDiffuse = vec4(0,0,0,1);
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
 
  //left eye
  modelViewStack.push(modelViewMatrix);  //PUSH
  t=translate(1.2, 2.5, .3); 
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.06);
  modelViewMatrix  = modelViewStack.pop();  //POP

  //right eye
  modelViewStack.push(modelViewMatrix);  //PUSH
  t=translate(.8, 2.5, .3); 
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.06);
  modelViewMatrix  = modelViewStack.pop();  //POP

  //mouth stones, 5 of them

  //leftmost
  modelViewStack.push(modelViewMatrix);  //PUSH
  t=translate(.8 ,2.278888, .28888); 
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix  = modelViewStack.pop();  //POP

  modelViewStack.push(modelViewMatrix);  //PUSH
  t=translate(.9, 2.24777, .32222); 
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix  = modelViewStack.pop();  //POP

  //middle stone
  modelViewStack.push(modelViewMatrix);  //PUSH
  t=translate(1, 2.234444, .33333); 
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix  = modelViewStack.pop();  //POP

  modelViewStack.push(modelViewMatrix);  //PUSH
  t=translate(1.1, 2.24777, .32222); 
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix  = modelViewStack.pop();  //POP

  //rightmost
  modelViewStack.push(modelViewMatrix);  //PUSH
  t=translate(1.2, 2.27888, .28888); 
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix  = modelViewStack.pop();  //POP
}

function DrawHat()
{


}
window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.2, .6, .2, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // coordinates of the initial points of the tetrahedron for drawing the unit sphere
  var va = vec4(0.0, 0.0, -1.0,1);
  var vb = vec4(0.0, 0.942809, 0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
  var vd = vec4(0.816497, -0.471405, 0.333333,1);
  tetrahedron(va, vb, vc, vd, numTimesToSubdivide);


  // draw mesh items
  QuadMailBox();
  MailPostPoints();

  //Draw primitives
  GenerateNose(.08,.45);

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

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    result[3][3]=1;
    return result;
}
// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
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


  modelViewStack.push(modelViewMatrix); //PUSH
        t=translate(1, .8, 0);
        modelViewMatrix=mult(modelViewMatrix,t); //move
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSnowmanBody();     //draw snowman body
	modelViewMatrix=modelViewStack.pop(); //POP
  

  modelViewStack.push(modelViewMatrix); //PUSH
        t=translate(-1.6, -.8, 0);
        s=scale4(.4, .4, .4);
        modelViewMatrix=mult(mult(modelViewMatrix,t), s); //shrink and move
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            DrawMailBoxHead();  //draw mailbox head
            DrawMailPost();     //draw mailbox post
            DrawMailFlag();
    modelViewMatrix=modelViewStack.pop(); //POP

        //DrawMailFlag();    
        DrawNose(); //draw snowman nose
        DrawFace(); //draw the snowmans eyes and mouth
  

  requestAnimFrame(render);
};
