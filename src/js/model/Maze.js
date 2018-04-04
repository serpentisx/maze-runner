class Maze {

  constructor() {
    this.wallCoords = [];
    this.mvs = [];

    this.wallLength = 1.2;
    this.wallHeight = 1;
    this.wallRatio = 4 / 2;
    this.wallWidth = 0.2;
    this.numVertices = 6;

    this.hasLoaded = false;
  }

  init(mazeFile, mv) {
    const fileLoc = `assets/${mazeFile}`;
    //const fileLoc = 'assets/test.txt';
    this.mazeArray = [];

    fetch(fileLoc)
      .then(res => res.text())
      .then(data => this.constructArray(data))
      .then(() => {
        this.initCoords(this.wallLength, this.wallHeight);
        this.buffer = initBuffer(this.vertices);
        initTextCoord(this.texCoords);
        this.initWallCoords();
        this.createTextures();

        this.hasLoaded = true;
      });
  }

  initCoords(wallLength, wallheight) {
    const mult = wallLength * 2;

    this.vertices = [
      this.generateWallVertices(wallLength, wallheight),
      this.generateWallVertices(wallLength * this.wallRatio, wallheight),
      this.generateWallVertices(wallLength * this.wallRatio, wallheight),
      this.generateGroundVertices()
    ].reduce((a, b) => a.concat(b), []);

    this.texCoords = [
      this.generateWallTextureCoords(mult),
      this.generateWallTextureCoords(mult * this.wallRatio),
      this.generateWallTextureCoords(0.5),
      this.generateGroundTextureCoords(55)
    ].reduce((a, b) => a.concat(b), []);

  }

  generateWallVertices(wallLength, wallheight) {
    return [
      vec4(0, 0.0, 0.0, 1.0),
      vec4(wallLength, 0.0, 0.0, 1.0),
      vec4(wallLength, wallheight, 0.0, 1.0),
      vec4(wallLength, wallheight, 0.0, 1.0),
      vec4(0, wallheight, 0.0, 1.0),
      vec4(0, 0.0, 0.0, 1.0)
    ];
  }

  generateGroundVertices() {
    return [
      vec4(-50.0, 0.0, -50.0, 1.0),
      vec4(50.0, 0.0, -50.0, 1.0),
      vec4(50.0, 0.0, 50.0, 1.0),
      vec4(50.0, 0.0, 50.0, 1.0),
      vec4(-50.0, 0.0, 50.0, 1.0),
      vec4(-50.0, 0.0, -50.0, 1.0),
    ];
  }

  generateWallTextureCoords(mult) {
    return [
      vec2(0.0, 0.0),
      vec2(mult, 0.0),
      vec2(mult, 1.0),
      vec2(mult, 1.0),
      vec2(0.0, 1.0),
      vec2(0.0, 0.0),
    ];
  }

  generateGroundTextureCoords(mult) {
    return [
      vec2(0.0, 0.0),
      vec2(mult, 0.0),
      vec2(mult, mult),
      vec2(mult, mult),
      vec2(0.0, mult),
      vec2(0.0, 0.0)
    ];
  }

  createTextures() {
    this.texVegg = generateTexture('VeggImage');
    this.texGolf = generateTexture('GolfImage');
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
      mv = mult(mv0, translate(0.0, 0.0, (this.wallLength * this.wallRatio) / 2 + -this.wallWidth / 2));
      mv0 = mv;
    }
  }

  initWallCoords() {
    let x = 0;
    let z = 0;
    for (let i = 0; i < this.mazeArray.length; i += 2) {
      let previousEmpty = false;
      for (let j = 0; j < this.mazeArray[i].length; j++) {
        const cell = this.mazeArray[i][j];
        if (cell === 'VERTEX') {
         const dx = this.setWallVertices(i, j, x, z); 
         x += dx;
        }
        if (!previousEmpty && cell === 'EMPTY') {
          previousEmpty = true;
          x += this.wallLength;
        } else previousEmpty = false;
      }
      x = 0;
      z += this.wallLength * this.wallRatio;
    }
  }

  setWallVertices(i, j, x0, z0) {
    z0 = i === 0 ? z0 + this.wallWidth : z0;
    
    if (i !== 0  || j !== 0) {
      x0 += this.wallWidth;
    }

    let dx = 0;
    if (this.mazeArray[i][j + 1] === 'HORIZONTAL') {
      this.wallCoords.push([[x0, z0 - this.wallWidth], [x0 + this.wallLength, z0]]);
      dx = this.wallLength;
    }

    if (this.mazeArray[i + 1]) {
      if (this.mazeArray[i + 1][j] === 'VERTICAL') {
        this.wallCoords.push([[x0, z0], [x0 + this.wallWidth, z0 + this.wallLength * this.wallRatio]]);
      }
    }
    return dx;
  }

  checkVertex(mv, cell, init) {
    let mat = {};
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

    this.draw3DThick(mv, this.wallLength, 0);

    return mult(mv, translate(this.wallLength, 0.0, 0.0));;
  }

  drawVerticalWall(mv) {
    const mv0 = mv;

    mv = mult(mv, translate(0.0, 0.0, this.wallLength * this.wallRatio));
    mv = mult(mv, rotateY(-90.0));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, 6, this.numVertices);

    this.draw3DThick(mv, this.wallLength * this.wallRatio, 6);

    return mv0;
  }

  draw3DThick(mv, d, index) {
    mv = mult(mv, translate(0.0, 0.0, this.wallWidth));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, index, this.numVertices);

    mv = mult(mv, scalem(1, 1, (this.wallWidth / 2) * (this.wallHeight / this.wallLength)));
    mv = mult(mv, rotateY(-90.0));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, 12, this.numVertices);

    mv = mult(mv, translate(0.0, 0.0, d));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, 12, this.numVertices);
  }

  drawGround(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this.texGolf);
    gl.drawArrays(gl.TRIANGLES, 18, this.numVertices);
  }

  render(gl, mv) {
    this.drawGround(gl);
    this.drawMaze(gl, mv);
  }

}
