
class Minimap extends Maze {

  constructor() {
    super();

    this.gl = gl_mini;
    this.mvLoc = mvLoc_mini;
    this.program = program_mini;

    this.rectangleSize = 0.2;
    this.verticesPoint = [];

    this.texBall = generateTexture(this.gl, this.program,  'BallImage');
    this.texMino = generateTexture(this.gl, this.program,  'MiniMino');

    this.initBuffer();
  }

  initBuffer() {
    const vertices = this.createRectanglePoint(0, 0);
    this.PointBuffer = initBuffer(this.gl, this.program, vertices, 'vPosition');
  }

  createRectanglePoint(x, z) {
    const r = this.rectangleSize;

    return [
      vec4(x+r, 1, z-r, 1),
      vec4(x+r, 1, z+r, 1),
      vec4(x-r, 1, z+r, 1),
      vec4(x-r, 1, z+r, 1),
      vec4(x-r, 1, z-r, 1),
      vec4(x+r, 1, z-r, 1)
    ];
  }

  bindBlobBuffer(gl, buffer, vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  }

  drawBlob(gl, userX, userZ) {
    this.bindBlobBuffer(gl, this.PointBuffer, this.createRectanglePoint(userX, userZ));

    gl.bindTexture(gl.TEXTURE_2D, this.texBall);
    gl.uniformMatrix4fv(this.mvLoc, false, flatten(this.mv));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  drawMinotaur(gl, x, z) {
    this.bindBlobBuffer(gl, this.PointBuffer, this.createRectanglePoint(x, z));

    gl.bindTexture(gl.TEXTURE_2D, this.texMino);
    gl.uniformMatrix4fv(this.mvLoc, false, flatten(this.mv));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  render(userX, userZ, minotaur) {
    super.render(this.mv);
    this.drawBlob(this.gl, userX, userZ);

    if (minotaur) {
      this.drawMinotaur(this.gl, minotaur.posX, minotaur.posZ);
    }
  }
}