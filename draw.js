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

function DrawHouse() {
  // draw house body
  changeColor(1, 1, 1);

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
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
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  // draw roof
  changeColor(1, 1, 1);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);

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
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  // draw door
  changeColor(1, 1, 1);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(1.5, 0.02, 4.55));
  modelViewMatrix = mult(modelViewMatrix, rotate(-90, 1.0, 0.0, 0.0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, 2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  // draw window
  changeColor(1, 1, 1);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(3.01, 0.5, 2));
  modelViewMatrix = mult(modelViewMatrix, rotate(90.0, 0.0, 0.0, 1.0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 1, 2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function DrawEnvironment() {
  changeColor(1, 1, 1);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);

  // wall # 1: in xz-plane
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, scale4(7, 1, 7));
  DrawWall(0.02);
  modelViewMatrix = modelViewStack.pop();

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);
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
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function DrawSnowmanBody() {
  changeColor(1, 1, 1);

  modelViewStack.push(modelViewMatrix); //PUSH
  DrawSolidSphere(0.6);
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(0, 0.9, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.5);
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(0, 1.6, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.4);
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawSolidSphere(radius) {
  modelViewStack.push(modelViewMatrix); //PUSH
  var s = scale4(radius, radius, radius); // scale to the given radius
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  // draw unit radius sphere
  for (var i = prismPointEnd; i < sphereCount + 22; i += 3)
    gl.drawArrays(gl.TRIANGLES, i, 3);
  // spherePointsEnd = i;
  modelViewMatrix = modelViewStack.pop(); //POP
}
function DrawMailBoxHead() {
  // change color of object
  changeColor(0.1, 0.1, 0.1);

  modelViewStack.push(modelViewMatrix); //PUSH
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
  gl.drawArrays(
    gl.TRIANGLES,
    spherePointsEnd,
    mailBoxPointEnd - spherePointsEnd
  );
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawMailFlag() {
  // change color of object
  changeColor(1, 0.1, 0.1);

  modelViewStack.push(modelViewMatrix); //PUSH
  modelViewMatrix = mult(modelViewMatrix, translate(1, 0.7, 1.1));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.009, 0.2, 0.3));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(
    gl.TRIANGLES,
    spherePointsEnd,
    mailBoxPointEnd - spherePointsEnd
  );
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  modelViewMatrix = mult(modelViewMatrix, translate(1, 0.6, 1.1));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.009, 0.3, 0.1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(
    gl.TRIANGLES,
    spherePointsEnd,
    mailBoxPointEnd - spherePointsEnd
  );
  modelViewMatrix = modelViewStack.pop(); //POP
}
function DrawMailPost() {
  // change color of object
  changeColor(1, 0.5, 0.3);

  modelViewStack.push(modelViewMatrix); //PUSH
  modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0)); //flip post on bottom of box
  modelViewMatrix = mult(modelViewMatrix, translate(0.25, 0.5, 0)); //move and put the post in the middle

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays(gl.TRIANGLES, mailBoxPointEnd, postPointEnd - mailBoxPointEnd);
  modelViewMatrix = modelViewStack.pop(); //POP
}
function DrawNose() {
  // change color of object
  changeColor(1, 0.5, 0);

  modelViewStack.push(modelViewMatrix); //PUSH
  modelViewMatrix = mult(modelViewMatrix, translate(0.93, 2.47, 0.1));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.3, 0.01, 0.5));
  modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, mailBoxPointEnd, nosePointEnd - mailBoxPointEnd);
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawFace() {
  // change color of object
  changeColor(0, 0, 0);

  //left eye
  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(1.2, 2.5, 0.3);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.06);
  modelViewMatrix = modelViewStack.pop(); //POP

  //right eye
  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(0.8, 2.5, 0.3);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.06);
  modelViewMatrix = modelViewStack.pop(); //POP

  //mouth stones, 5 of them

  //leftmost
  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(0.8, 2.278888, 0.28888);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(0.9, 2.24777, 0.32222);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix = modelViewStack.pop(); //POP

  //middle stone
  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(1, 2.234444, 0.33333);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(1.1, 2.24777, 0.32222);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix = modelViewStack.pop(); //POP

  //rightmost
  modelViewStack.push(modelViewMatrix); //PUSH
  t = translate(1.2, 2.27888, 0.28888);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.04);
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawTree() {
  // change color of object
  changeColor(1, 1, 1);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);

  gl.drawArrays(gl.TRIANGLES, nosePointEnd, 6 * 24 * 24);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function DrawAlphaLights() {
  changeColor(1, 0, 0);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(4.5, 0.65, 2.5));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(0, 0, 1);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(5.5, 0.65, 1.2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(1, 1, 0);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(4.9, 1.4, 1.9));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(1, 0, 0);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(5.15, 1.4, 1.3));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(1, 0, 0);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(4.3, 2, 2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawBetaLights() {
  changeColor(0, 1, 0);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(5.2, 0.7, 2));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(0, 0, 1);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(4.2, 1.4, 2.1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(1, 0, 1);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(5, 2, 1.7));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(1, 1, 0);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(3.8, 0.65, 2.3));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP

  changeColor(0, 0, 1);
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(4.6, 2.3, 1.9));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(0.1);
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawStar() {
  // change color of object
  changeColor(1, 1, 0);

  modelViewStack.push(modelViewMatrix); //PUSH
  s = scale4(0.0777, 0.0777, 0.0777);
  modelViewMatrix = mult(modelViewMatrix, s);
  //modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, treePointEnd, 6 * N + 1 * 3 * 2);
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  s = scale4(0.0777, 0.0777, 0.0777);
  r = rotate(180, 1, 0, 0);
  t = translate(0.2, -2, -4);
  modelViewMatrix = mult(modelViewMatrix, s);
  modelViewMatrix = mult(modelViewMatrix, r);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, treePointEnd, 6 * N + 1 * 3 * 2);
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawSnow() {
  changeColor(1, 1, 1);

  for (var i = 0; i < snowArray.length; i++) {
    modelViewStack.push(modelViewMatrix); //PUSH
    t = translate(snowArray[i][0], snowArray[i][1], snowArray[i][2]);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidSphere(0.05);
    modelViewMatrix = modelViewStack.pop(); //POP
  }
}

function DrawHat() {
  changeColor(0.12, 0.1, 0.1);
  modelViewStack.push(modelViewMatrix); //PUSH
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, treePointEnd + 24, 132);
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix); //PUSH
  r = rotate(180, 0, 1, 0);
  modelViewMatrix = mult(modelViewMatrix, r);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, treePointEnd + 24, 132);
  modelViewMatrix = modelViewStack.pop(); //POP

  modelViewStack.push(modelViewMatrix);
  s = scale4(2, 0.2, 2);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(1.3);
  modelViewMatrix = modelViewStack.pop(); //POP
}

function DrawArmsAndButtons() {
  // change color of object
  changeColor(0.6, 0.2, 0.1);
  modelViewStack.push(modelViewMatrix); //PUSH
  s = scale4(0.05, 0.05, 1);
  t = translate(1, 1.5, 6);
  r = rotate(180, 1, 0, 1);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, r);
  modelViewMatrix = mult(modelViewMatrix, s);
  r = rotate(45, 1, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(
    gl.TRIANGLES,
    spherePointsEnd,
    mailBoxPointEnd - spherePointsEnd
  );
  modelViewMatrix = modelViewStack.pop(); //POP
}
