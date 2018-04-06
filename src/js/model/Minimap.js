
var colorBall = vec4(0.25, 0.25, 0.25, 1.0);

class Minimap extends Maze {

  constructor() {
    super();

    this.gl = gl_mini;
    this.mvLoc = mvLoc_mini;
    this.program = program_mini;

    this.rectangleSize = 1;
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

  render(userX, userZ) {
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    super.render(this.mv);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.PointBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.createRectanglePoint(userX, userZ)), gl.STATIC_DRAW);

    this.gl.bindTexture(gl.TEXTURE_2D, this.texBall);
    this.gl.uniformMatrix4fv(this.mvLoc, false, flatten(this.mv));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);  
  }
}