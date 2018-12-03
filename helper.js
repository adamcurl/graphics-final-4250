/********** HELPER FUNCTIONS **********/
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

function textureQuad(a, b, c, d) {
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  normal = normalize(normal);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[d]);
  normalsArray.push(normal);
  texCoordsArray.push(texCoord[3]);

  numVertices += 6;
}

function quadAlt(a, b, c, d) {
  var points = [a, b, c, d];
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

  numVertices += 9;
}

function Newell(verts) {
  var L = verts.length;
  var x = 0,
    y = 0,
    z = 0;
  var index, nextIndex;

  for (var i = 0; i < L; i++) {
    index = i;
    nextIndex = (i + 1) % L;

    x +=
      (verts[index][1] - verts[nextIndex][1]) *
      (verts[index][2] + verts[nextIndex][2]);
    y +=
      (verts[index][2] - verts[nextIndex][2]) *
      (verts[index][0] + verts[nextIndex][0]);
    z +=
      (verts[index][0] - verts[nextIndex][0]) *
      (verts[index][1] + verts[nextIndex][1]);
  }

  return normalize(vec3(x, y, z));
}

function triangle(a, b, c) {
  normalsArray.push(vec3(a[0], a[1], a[2]));
  normalsArray.push(vec3(b[0], b[1], b[2]));
  normalsArray.push(vec3(c[0], c[1], c[2]));

  pointsArray.push(a);
  pointsArray.push(b);
  pointsArray.push(c);

  sphereCount += 3;
  numVertices += 3;
}
// a, b, c, and d are all vec4 type
function triangleAlt(a, b, c) {
  var points = [a, b, c];
  var normal = Newell(points);

  // triangle abc
  pointsArray.push(a);
  normalsArray.push(normal);
  pointsArray.push(b);
  normalsArray.push(normal);
  pointsArray.push(c);
  normalsArray.push(normal);

  numVertices += 3;
}

function divideTriangle(a, b, c, count) {
  if (count > 0) {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);

    divideTriangle(a, ab, ac, count - 1);
    divideTriangle(ab, b, bc, count - 1);
    divideTriangle(bc, c, ac, count - 1);
    divideTriangle(ab, bc, ac, count - 1);
  } else {
    triangle(a, b, c);
  }
}

function tetrahedron(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}

// a 4x4 matrix multiple by a vec4
function multiply(m, v) {
  var vv = vec4(
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
    m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3]
  );
  return vv;
}

function surfaceQuad(a, b, c, d) {
  var indices = [a, b, c, d];
  var normal = surfaceNewell(indices);

  // triangle a-b-c
  pointsArray.push(surfaceVertices[a]);
  normalsArray.push(normal);

  pointsArray.push(surfaceVertices[b]);
  normalsArray.push(normal);

  pointsArray.push(surfaceVertices[c]);
  normalsArray.push(normal);

  // triangle a-c-d
  pointsArray.push(surfaceVertices[a]);
  normalsArray.push(normal);

  pointsArray.push(surfaceVertices[c]);
  normalsArray.push(normal);

  pointsArray.push(surfaceVertices[d]);
  normalsArray.push(normal);

  numVertices += 6;
}

function surfaceNewell(indices) {
  var L = indices.length;
  var x = 0,
    y = 0,
    z = 0;
  var index, nextIndex;

  for (var i = 0; i < L; i++) {
    index = indices[i];
    nextIndex = indices[(i + 1) % L];

    x +=
      (surfaceVertices[index][1] - surfaceVertices[nextIndex][1]) *
      (surfaceVertices[index][2] + surfaceVertices[nextIndex][2]);
    y +=
      (surfaceVertices[index][2] - surfaceVertices[nextIndex][2]) *
      (surfaceVertices[index][0] + surfaceVertices[nextIndex][0]);
    z +=
      (surfaceVertices[index][0] - surfaceVertices[nextIndex][0]) *
      (surfaceVertices[index][1] + surfaceVertices[nextIndex][1]);
  }

  return normalize(vec3(x, y, z));
}

function changeColor(a, b, c) {
  materialAmbient = vec4(a, b, c, 1);
  materialDiffuse = vec4(a, b, c, 1);
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
}

function NewellAlt(indices) {
  var L = indices.length;
  var x = 0,
    y = 0,
    z = 0;
  var index, nextIndex;

  for (var i = 0; i < L; i++) {
    index = indices[i];
    nextIndex = indices[(i + 1) % L];

    x +=
      (vertices[index][1] - vertices[nextIndex][1]) *
      (vertices[index][2] + vertices[nextIndex][2]);
    y +=
      (vertices[index][2] - vertices[nextIndex][2]) *
      (vertices[index][0] + vertices[nextIndex][0]);
    z +=
      (vertices[index][0] - vertices[nextIndex][0]) *
      (vertices[index][1] + vertices[nextIndex][1]);
  }

  return normalize(vec3(x, y, z));
}

function polygon(indices) {
  var M = indices.length;
  var normal = NewellAlt(indices);

  var prev = 1;
  var next = 2;

  for (var i = 0; i < M - 2; i++) {
    pointsArray.push(vertices[indices[0]]);
    normalsArray.push(normal);

    pointsArray.push(vertices[indices[prev]]);
    normalsArray.push(normal);

    pointsArray.push(vertices[indices[next]]);
    normalsArray.push(normal);

    prev = next;
    next = next + 1;
  }
}

function ExtrudedShape() {
  var basePoints = [];
  var topPoints = [];

  // create the face list
  // add the side faces first
  for (var j = 0; j < N; j++) {
    quad(j, j + N, ((j + 1) % N) + N, (j + 1) % N);
  }

  // the first vertices come from the base
  basePoints.push(0);
  for (var i = N - 1; i > 0; i--) {
    basePoints.push(i); // index only
  }
  // add the base face as the Nth face
  polygon(basePoints);

  // the next vertices come from the top
  for (var i = 0; i < N; i++) {
    topPoints.push(i + N); // index only
  }
  // add the top face
  polygon(topPoints);
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function loadTexture(texture) {
  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Enable texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set the texture image
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    texture.image
  );

  // set the texture parameters
  //gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // set the texture unit 0 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
