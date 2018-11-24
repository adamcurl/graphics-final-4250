// bow point positions
var bowStartPoint = 0;
var bowEndPoint = 0;

// to keep track of point positions
var boxPointEnd = 0;
var bowPointEnd = 0;
var wrapPointEnd = 0;
var prismPointEnd = 0;
var mailBoxPointEnd = 0;
var postPointEnd = 0;
var spherePointsEnd = 0;
var hatPointEnd = 0;
var nosePointEnd = 0; //((stacks-1)*6+3)*slices
var treePointEnd = 0;

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
  vec4(0, 0.5, 1, 1), // 21
  // mailbox top points
  vec4(0, 0, 0, 1), // A(22)
  vec4(1, 0, 0, 1), // B(23)
  vec4(1, 1, 0, 1), // C(24)
  vec4(0, 1, 0, 1), // D(25)
  vec4(0, 0, 2, 1), // E(26)
  vec4(1, 0, 2, 1), // F(27)
  vec4(1, 1, 2, 1), // G(28)
  vec4(0, 1, 2, 1), // H(29)
  //post points
  vec4(0, 0, 0, 1), // I(30)
  vec4(0.5, 0, 0, 1), // J(31)
  vec4(0.5, 0.75, 0, 1), // K(32)
  vec4(0.25, 1, 0, 1), // L(33)
  vec4(0, 0.75, 0, 1), // M(34)
  vec4(0, 0, 5, 1), // N(35)
  vec4(0.5, 0, 5, 1), // O(36)
  vec4(0.5, 0.75, 5, 1), // P(37)
  vec4(0.25, 1, 5, 1), // Q(38)
  vec4(0, 0.75, 5, 1) // R(39)
];

var surfaceVertices = [];

var treePoints = [
  [0, 0, 0],
  [1, 0, 0],
  [0.2, 0.2, 0],
  [0.8, 0.2, 0],
  [0.2, 0.4, 0],
  [0.6, 0.4, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0],
  [0, 0.8, 0]
  // [0, 0.104, 0.0],
  // [0.028, 0.11, 0.0],
  // [0.052, 0.126, 0.0],
  // [0.068, 0.161, 0.0],
  // [0.067, 0.197, 0.0],
  // [0.055, 0.219, 0.0],
  // [0.041, 0.238, 0.0],
  // [0.033, 0.245, 0.0],
  // [0.031, 0.246, 0.0],
  // [0.056, 0.257, 0.0],
  // [0.063, 0.266, 0.0],
  // [0.059, 0.287, 0.0],
  // [0.048, 0.294, 0.0],
  // [0.032, 0.301, 0.0],
  // [0.027, 0.328, 0.0],
  // [0.032, 0.38, 0.0],
  // [0.043, 0.41, 0.0],
  // [0.058, 0.425, 0.0],
  // [0.066, 0.433, 0.0],
  // [0.069, 0.447, 0.0],
  // [0.093, 0.465, 0.0],
  // [0.107, 0.488, 0.0],
  // [0.106, 0.512, 0.0],
  // [0.115, 0.526, 0.0],
  // [0, 0.525, 0.0]
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
  console.log(vertices.length);
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

function QuadMailBox() {
  quad(22, 26, 29, 25); // AEHD
  quad(23, 24, 28, 27); // BCGF
  quad(22, 23, 27, 26); // ABFE
  quad(25, 24, 28, 29); // DCGH
  quad(26, 27, 28, 29); // EFGH
  quad(22, 23, 24, 25); // ABCD

  mailBoxPointEnd = numVertices;
  console.log("mailBoxPointEnd", mailBoxPointEnd); //total number of points for mailbox top
}

function MailPostPoints() {
  quad(30, 35, 39, 34); // INRM
  quad(33, 34, 39, 38); // LMRQ
  quad(32, 33, 38, 37); //KLQP
  quad(31, 32, 37, 36); //JKPO
  quad(30, 31, 36, 35); //IJON
  pentagon(35, 36, 37, 38, 39); //NOPQR
  pentagon(30, 34, 33, 32, 31); // IMLKJ

  postPointEnd = numVertices;
  console.log("postpointend", postPointEnd); //total number of points for post
}

function GenerateNose(radius, height) {
  //var hypotenuse=Math.sqrt(height*height + radius*radius);
  var stacks = 8;
  var slices = 12;
  // starting out with a single line in xy-plane
  var line = [];
  var segmentX = radius / stacks;
  var segmentY = height / stacks;
  for (var p = 0; p <= stacks; p++) {
    line.push(vec4(p * segmentX, p * segmentY, 0, 1));
  }

  prev = line;
  // rotate around y axis
  var m = rotate(360 / slices, 0, 1, 0);
  for (var i = 1; i <= slices; i++) {
    var curr = [];

    // compute the new set of points with one rotation
    for (var j = 0; j <= stacks; j++) {
      var v4 = multiply(m, prev[j]);
      curr.push(v4);
    }

    // triangle bottom of the cone
    triangleAlt(prev[1], prev[0], curr[1]);

    // create the triangles for this slice
    for (var j = 1; j < stacks; j++) {
      prev1 = prev[j];
      prev2 = prev[j + 1];

      curr1 = curr[j];
      curr2 = curr[j + 1];

      //quad(prev1, curr1, curr2, prev2);
      quadAlt(prev2, prev1, curr1, curr2);
    }

    prev = curr;
  }
  nosePointEnd = numVertices;
}

function GenerateTreePoints() {
  var pointLen = treePoints.length;
  //Setup initial points matrix
  for (var i = 0; i < pointLen; i++) {
    surfaceVertices.push(
      vec4(treePoints[i][0], treePoints[i][1], treePoints[i][2], 1)
    );
  }

  var r;
  var t = Math.PI / 12;

  // sweep the original curve another "angle" degree
  for (var j = 0; j < pointLen - 1; j++) {
    var angle = (j + 1) * t;

    // for each sweeping step, generate 25 new points corresponding to the original points
    for (var i = 0; i < pointLen; i++) {
      r = surfaceVertices[i][0];
      surfaceVertices.push(
        vec4(
          r * Math.cos(angle),
          surfaceVertices[i][1],
          -r * Math.sin(angle),
          1
        )
      );
    }
  }

  var N = pointLen;
  // quad strips are formed slice by slice (not layer by layer)
  for (
    var i = 0;
    i < pointLen - 1;
    i++ // slices
  ) {
    for (
      var j = 0;
      j < pointLen - 1;
      j++ // layers
    ) {
      surfaceQuad(
        i * N + j,
        (i + 1) * N + j,
        (i + 1) * N + (j + 1),
        i * N + (j + 1)
      );
    }
  }
  treePointEnd = numVertices;
}
