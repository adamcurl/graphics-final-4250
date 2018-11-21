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
