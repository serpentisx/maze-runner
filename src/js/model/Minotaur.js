class Minotaur extends GameItem {

  constructor() {
    super('./assets/minotaur.ply', 'Stone');

    this.scaling = 0.3;
    
    this.texCoords = [
      vec2(0.0, 0.0),
      vec2(100, 0.0),
      vec2(100, 100.0),
      vec2(100, 100.0),
      vec2(0.0, 100.0),
      vec2(0.0, 0.0),
    ];

    this.hasLoaded = false;
  }

  setGrid(grid){
    this.grid = grid;
    this.clearPathGrid();
  }

  clearPathGrid(){
    this.pathGrid = [...Array(this.grid.length)].map(e => Array(this.grid[0].length));
    for(let i = 0; i < this.pathGrid.length; i++){
      for(let j = 0; j < this.pathGrid[0].length; j++) {
        this.pathGrid[i][j] = false;
      }
    }
  }

  calculatePath(userPos) {      
    this.clearPathGrid();
    this.path = [];
     
    this.traversed = [];

    this.traverseTree(userPos);
    this.setPath(this.traversed);
  }    

  traverseTree(userPos) {
    const x = this.cell[1];
    const z = this.cell[0];
    console.log('user', userPos);
    console.log('minotaur', z, x);
    
    this.pathGrid[z][x] = true;

    this.stack = [];
    this.stack.push([[null], [z, x]]);   
    
    while (this.stack.length !== 0) {
      let prevStack = this.stack.pop();
      let v = prevStack[1];

      if (v[0] !== null) {
        this.traversed.push([v[0], v[1]]);
        if (userPos[0] === v[0] && userPos[1] === v[1]) {
          return;
        }
      }
      if ((v[0] - 1) >= 0) this.mark(v, [v[0] - 1, v[1]], 'UP');
      if ((v[0] + 1) < this.grid.length) this.mark(v, [v[0] + 1, v[1]], 'DOWN');
      if ((v[1] - 1) >= 0) this.mark(v, [v[0], v[1] - 1], 'LEFT');
      if ((v[1] + 1) < this.grid[0].length) this.mark(v, [v[0], v[1] + 1], 'RIGHT');
    }    
  }

  setPath() {
    let currentNode = this.traversed[0]
    console.log(this.traversed);
    
    // for(let i = this.traversed.length-1; i >= 0; i--) {
    //   this.path.push()
    // }
  }

  mark(currentTile, nextTile, direction) {    
    const z = currentTile[0];
    const x = currentTile[1];
    const nZ = nextTile[0];
    const nX = nextTile[1];    
    
    for(let i = 0; i < this.grid[z][x].length; i ++ ) {       
      if (this.grid[z][x][i] === direction && !this.pathGrid[nZ][nX]) {        
        this.pathGrid[nZ][nX] = true;
        this.stack.push([currentTile, nextTile]);  
        return;
      }
    }
  }

  setPosition(x, z) {
    this.posX = x;
    this.posZ = z;
  }

  getPosition() {
    return { x: this.posX, z: this.posZ };
  }

  getPositionMatrix() {
    let mv = translate(this.posX, this.scaling, this.posZ);
    mv = mult(mv, scalem(this.scaling, this.scaling, this.scaling));

    return mv;
  }
}