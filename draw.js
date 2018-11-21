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