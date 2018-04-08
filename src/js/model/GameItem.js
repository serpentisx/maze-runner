class GameItem {

  constructor(plyPath, textureName) {
    this.gl = gl;
    this.mvLoc = mvLoc;
    this.program = program;

    this.plyPath = plyPath;
    this.textureName = textureName;
    this.isDestroyed = false;
  }

  init() {
    const PR = PlyReader();
    const plyData = PR.read(this.plyPath);

    this.vertices = plyData.points;
    this.normals = plyData.normals;

    this.normalBuffer = initBuffer(this.gl, this.program, this.normals, 'vNormal');
    this.verticeBuffer = initBuffer(this.gl, this.program, this.vertices, 'vPosition');

    this.vTexCoord = initTextCoord(this.gl, this.program, this.texCoords);
    this.texture = generateTexture(this.gl, this.program, this.textureName);

    this.hasLoaded = true;
  }

  getPositionMatrix() {
    let mv = translate(0, 0, 0);

    return mv;
  }

  bindVerticesBuffer(gl, buffer, vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  }

  changeTexture(gl) {
    gl.vertexAttribPointer(this.vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vTexCoord);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  checkCollisionWithUser(userX, userZ) {
    const p = { x: userX, y: userZ };
    const r = [[this.posX, this.posZ], [this.posX, this.posZ]];

    const collision = Utils.pointInsideRectangle(p, r, this.recOffset);

    return collision;
  }

  render(mv, userX, userZ) {
    if (this.hasLoaded) {
      mv = mult(mv, this.getPositionMatrix());

      this.bindVerticesBuffer(this.gl, this.verticeBuffer, this.vertices);
      this.changeTexture(this.gl);
      this.gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv));
      this.gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
    }
  }
}