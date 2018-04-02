class Maze {

  constructor() {
    this.wallLength = 1;
    this.wallHeight = 1;
    this.wallWidth = 0.02;
    this.offset = 1;
    this.numVertices = 6;
  }

  init(mazeFile) {
    const fileLoc = `assets/${mazeFile}`;
    // const fileLoc = `assets/test.txt`;
    this.mazeArray = [];

    fetch(fileLoc)
      .then(res => res.text())
      .then(data => this.constructArray(data))
      .then(() => {        
        this.initCoords(this.wallLength, this.wallHeight);
        initVertices(this.vertices);
        initTextCoord(this.texCoords);

        this.createTextures();
      });
  }

  initCoords(wallLength, wallheight) {
    const mult = wallLength * 2;

    this.vertices = [
      vec4(0, 0.0, 0.0, 1.0),
      vec4(wallLength, 0.0, 0.0, 1.0),
      vec4(wallLength, wallheight, 0.0, 1.0),
      vec4(wallLength, wallheight, 0.0, 1.0),
      vec4(0, wallheight, 0.0, 1.0),
      vec4(0, 0.0, 0.0, 1.0),
      // Hnútar gólfsins (strax á eftir)
      vec4(-5.0, 0.0, 10.0, 1.0),
      vec4(5.0, 0.0, 10.0, 1.0),
      vec4(5.0, 0.0, 0.0, 1.0),
      vec4(5.0, 0.0, 0.0, 1.0),
      vec4(-5.0, 0.0, 0.0, 1.0),
      vec4(-5.0, 0.0, 10.0, 1.0)
    ];

    this.texCoords = [
      vec2(0.0, 0.0),
      vec2(mult, 0.0),
      vec2(mult, 1.0),
      vec2(mult, 1.0),
      vec2(0.0, 1.0),
      vec2(0.0, 0.0),
      // Mynsturhnit fyrir gólf
      vec2(0.0, 0.0),
      vec2(10.0, 0.0),
      vec2(10.0, 10.0),
      vec2(10.0, 10.0),
      vec2(0.0, 10.0),
      vec2(0.0, 0.0)
    ];
  }

  createTextures() {
    this.texVegg = generateTexture('VeggImage');
    this.texGolf = generateTexture('GolfImage');
    this.texLoft = generateTexture('LoftImage');
  }

  constructArray(textFile) {
    const lines = textFile.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      this.mazeArray[i] = [];
      for (let j = 0; j < line.length; j += 1) {
        const symbol = line[j];
        switch (symbol) {
          case ' ':
            this.mazeArray[i].push('EMPTY');
            break;
          case '+':
            this.mazeArray[i].push('VERTEX');
            break;
          case '-':
            this.mazeArray[i].push('HORIZONTAL');
            break;
          case '|':
            this.mazeArray[i].push('VERTICAL');
            break;
        }
      }
    }
  }

  drawMaze(gl, mv) {
    let mv0 = mv;

    gl.bindTexture(gl.TEXTURE_2D, this.texVegg);

    for (let i = 0; i < this.mazeArray.length; i++) {
      let previousEmpty = false;
      for (let j = 0; j < this.mazeArray[i].length; j++) {
        const cell = this.mazeArray[i][j];
        if (cell === 'VERTEX') {
          if (i + 1 < this.mazeArray.length) {
            mv = this.checkVertex(mv, this.mazeArray[i + 1][j]);
          }
          if (j + 1 < this.mazeArray[i].length) {
            mv = this.checkVertex(mv, this.mazeArray[i][j + 1]);
          }
        }
        if (!previousEmpty && cell === 'EMPTY') {
          previousEmpty = true;
          mv = mult(mv, translate(this.wallLength, 0.0, 0.0));
        } else previousEmpty = false;
      }
      mv = mult(mv0, translate(0.0, 0.0, this.wallLength / 2));
      mv0 = mv;
    }
  }

  checkVertex(mv, cell) {
    switch (cell) {
      case 'HORIZONTAL':
        mv = this.drawHorizontalWall(mv);
        break;
      case 'VERTICAL':
        mv = this.drawVerticalWall(mv);
        break;
      default:
        break;
    }
    return mv;
  }

  drawHorizontalWall(mv) {
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);

    return mv = mult(mv, translate(this.wallLength, 0.0, 0.0));
  }

  drawVerticalWall(mv) {
    const mv0 = mv;

    mv = mult(mv, translate(0.0, 0.0, this.wallLength));
    mv = mult(mv, rotateY(-90.0));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);

    return mult(mv0, translate(0.0, 0.0, 0.0));
  }

  drawGround(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this.texGolf);
    gl.drawArrays(gl.TRIANGLES, this.numVertices, this.numVertices);
  }

  render(gl, mv) {
    this.drawGround(gl);
    this.drawMaze(gl, mv);
  }

}
