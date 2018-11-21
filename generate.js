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
var nosePointEnd = 540; //((stacks-1)*6+3)*slices

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
