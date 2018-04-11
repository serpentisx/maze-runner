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


    this.path = []; 
    this.finishedMoving = true;
    this.direction;
    this.moves;

    this.hasLoaded = false;
  }

  setGrid(grid){
    this.grid = grid;
    this.clearPathGrid();
  }

  setUser(user) {
    this.user = user;
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
    this.setPath(userPos, this.traversed)
    
  }    

  setPath(userPos, traversed) {
    this.path.push(userPos);
    console.log(userPos);
    
    let find = userPos;
    for(let i = traversed.length-1; i > 0; i--) {
      const currentNode = traversed[i][1];
      const nextNode = traversed[i][0];
      if(currentNode[0] === find[0] && currentNode[1] === find[1]) {
       this.path.push(nextNode);
       find = nextNode;
      }
    }
  }

  traverseTree(userPos) {
    const x = this.cell[1];
    const z = this.cell[0];

    this.stack = [];
    this.stack.push([[null], [z, x]]);
    this.pathGrid[z][x] = true;

    while (this.stack.length !== 0) {
      let prevStack = this.stack.pop();
      let v = prevStack[1];

      if (v[0] !== null) {
        this.traversed.push(prevStack);
        if (userPos[0] === v[0] && userPos[1] === v[1]) {
          return;
        }
      }

      // This could be optimised by turning it into a SWITCH
      if ((v[0] - 1) >= 0) this.mark(v, [v[0] - 1, v[1]], 'UP');
      if ((v[0] + 1) < this.grid.length) this.mark(v, [v[0] + 1, v[1]], 'DOWN');
      if ((v[1] - 1) >= 0) this.mark(v, [v[0], v[1] - 1], 'LEFT');
      if ((v[1] + 1) < this.grid[0].length) this.mark(v, [v[0], v[1] + 1], 'RIGHT');
    }  

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

  //The minotaur moves in turns, vertical turn is 2.6, horizontal 1.3
  //When the minotaur has depleted its moves, it calculates the next
  update(){    
    if(this.moves <= 0) {
      this.finishedMoving = true;
    } else {
      this.moveMinotaur();
    }
    if(this.finishedMoving) {
      this.findNextMove();
    }
  }

  moveMinotaur() {
    const dir = this.direction;
    switch (dir) {
      case 'UP':
        this.posZ -= 0.01;
        this.moves -= 0.01;
        break;
      case 'DOWN':
        this.posZ += 0.01;
        this.moves -= 0.01;
        break;
      case 'LEFT':
        this.posX -= 0.01;
        this.moves -= 0.01;
        break;
      case 'RIGHT':
        this.posX += 0.01;
        this.moves -= 0.01;
        break;
      default:
        break;
    }
  }


  findNextMove(){
    const currentPos = this.path.pop();

    // if the currentPosition in the path stack is not equal to the minotuars cell 
    // position, recalculate from current position
    if(currentPos[0] !== this.cell[0] || currentPos[1] !== this.cell[1]) { 
      console.log("Here");
           
      this.calculatePath(this.user.cell)
      return;
    }
    const nextPos = this.path[this.path.length-1];
    if(currentPos[0] > nextPos[0]){
      this.direction = 'UP';
      this.moves = 2.6; //hardcoded for length of wall in vertical
    } else if(currentPos[0] < nextPos[0]) {
      this.direction = 'DOWN';
      this.moves = 2.6;
    } else if(currentPos[1] < nextPos[1]) {
      this.direction = 'RIGHT';
      this.moves = 1.3; 
    } else if(currentPos[1] > nextPos[1]) {
      this.direction = 'LEFT';
      this.moves = 1.3;
    }
    this.finishedMoving = false;
    
  }

  getPositionMatrix() {
    let mv = translate(this.posX, this.scaling, this.posZ);
    mv = mult(mv, scalem(this.scaling, this.scaling, this.scaling));

    return mv;
  }
}