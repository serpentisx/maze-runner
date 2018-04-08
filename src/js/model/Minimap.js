
class Minimap extends Maze {

  constructor() {
    super();

    this.gl = gl_mini;
    this.mvLoc = mvLoc_mini;
    this.program = program_mini;

    this.rectangleSize = 0.2;
    this.verticesPoint = [];

    this.texBall = generateTexture(this.gl, this.program,  'BallImage');
    this.initBuffer();
  }

  initBuffer() {
    const vertices = this.createRectanglePoint(0, 0);
    this.PointBuffer = initBuffer(this.gl, this.program, vertices);
  }

  createRectanglePoint(x, z) {
    const r = this.rectangleSize;

    return [
      vec4(x+r, 0, z-r, 1),
      vec4(x+r, 0, z+r, 1),
      vec4(x-r, 0, z+r, 1),
      vec4(x-r, 0, z+r, 1),
      vec4(x-r, 0, z-r, 1),
      vec4(x+r, 0, z-r, 1)
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

  render(userX, userZ) {
    super.render(this.mv);
    this.drawBlob(this.gl, userX, userZ);
  }
}