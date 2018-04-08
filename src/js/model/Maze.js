class Maze {

  constructor() {
    this.gl = gl;
    this.mvLoc = mvLoc;
    this.program = program;
    
    this.wallCoords = [];
    this.mvs = [];

    this.wallLength = 1.3;
    this.wallHeight = 1;
    this.wallRatio = 4 / 2;
    this.wallWidth = 0.2;
    this.numVertices = 6;
  
    this.hasLoaded = false;
  }

  async init(mazeFile) {
    const fileLoc = `assets/${mazeFile}`;
    this.mazeArray = [];

    fetch(fileLoc)
      .then(res => res.text())
      .then(data => this.constructArray(data))
      .then(() => {
        this.initCoords(this.wallLength, this.wallHeight);
        this.buffer = initBuffer(this.gl, this.program, this.vertices, 'vPosition');
        this.vTexCoord = initTextCoord(this.gl, this.program, this.texCoords);
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
      this.generateGroundTextureCoords(100),
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
    this.texVegg = generateTexture(this.gl, this.program,  'VeggImage');
    this.texGolf = generateTexture(this.gl, this.program, 'GolfImage');
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
      mv = mult(mv0, translate(0.0, 0.0, (this.wallLength * this.wallRatio) / 2));
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
    let dx = 0;
    if (this.mazeArray[i][j + 1] === 'HORIZONTAL') {
      this.wallCoords.push([[x0, z0], [x0 + this.wallLength, z0 + this.wallWidth]]);
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
    this.gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices);

    this.draw3DThick(mv, this.wallLength, 0);

    return mult(mv, translate(this.wallLength, 0.0, 0.0));;
  }

  drawVerticalWall(mv) {
    const mv0 = mv;

    mv = mult(mv, translate(0.0, 0.0, this.wallLength * this.wallRatio));
    mv = mult(mv, rotateY(-90.0));
    this.gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv));
    this.gl.drawArrays(this.gl.TRIANGLES, 6, this.numVertices);

    this.draw3DThick(mv, this.wallLength * this.wallRatio, 6);

    return mv0;
  }

  draw3DThick(mv, d, index) {
    mv = mult(mv, translate(0.0, 0.0, this.wallWidth));
    this.gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv));
    this.gl.drawArrays(this.gl.TRIANGLES, index, this.numVertices);

    mv = mult(mv, scalem(1, 1, (this.wallWidth / 2) * (this.wallHeight / this.wallLength)));
    mv = mult(mv, rotateY(-90.0));
    this.gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv));
    this.gl.drawArrays(this.gl.TRIANGLES, 12, this.numVertices);

    mv = mult(mv, translate(0.0, 0.0, d));
    this.gl.uniformMatrix4fv(this.mvLoc, false, flatten(mv));
    this.gl.drawArrays(this.gl.TRIANGLES, 12, this.numVertices);
  }

  drawGround(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this.texGolf);
    gl.drawArrays(gl.TRIANGLES, 18, this.numVertices);
  }

  bindVerticesBuffer(gl, buffer, vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  }

  changeTextureStyle(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(this.program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
  }

  render(mv) {
    if (this.hasLoaded) {
      this.changeTextureStyle(this.gl);
      this.bindVerticesBuffer(this.gl, this.buffer, this.vertices);

      this.drawGround(this.gl);
      this.drawMaze(this.gl, mv);
    }
  }
}
