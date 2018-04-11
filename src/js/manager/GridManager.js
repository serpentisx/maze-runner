class GridManager {
    constructor(user, minotaur, maze) {        
        this.user = user;
        this.minotaur = minotaur;
        this.cellWidth = maze.wallLength;
        this.cellLength = maze.wallLength * maze.wallRatio;
        this.wallWidth = maze.wallWidth;
        this.hasLoaded = false;
    }

    init (maze) {            
        this.grid = this.constructGrid(maze, this.gridDimensions(maze));           
        this.generateMinotaurPos();
        this.generateUserPos()
        this.hasLoaded = true;
    }

    /* Generates a random cell positions, checks first to see whether 
    * it is occupied by the minotaur, if not, set user coordinates
    * and cell position
    */
    generateUserPos() {
        const { posX, posZ } = this.generateGridPosition();
        if (posX === this.minotaur.cell[1] && posZ === this.minotaur.cell[0]) {
            this.generateUserPos();
            return;
        }       
        const { x, z } = this.cellToPixels(posX, posZ) ;
        this.user.setPosition(x, z);
        this.user.cell = [x, z];            
    }

    generateMinotaurPos() {
        const { posX, posZ } = this.generateGridPosition();
        const { x, z } = this.cellToPixels(posX, posZ);
        if(this.user.cell && posX === this.user.cell[1] && posZ === this.user.cell[0]) {
            this.generateMinotaurPos();
            return;
        }
        this.minotaur.setPosition(x, z);
        this.minotaur.cell = [posZ, posX];
    }

    generateGridPosition() {                
       const posX = Math.floor(Math.random() * Math.floor(this.grid[0].length));
       const posZ = Math.floor(Math.random() * Math.floor(this.grid.length));
       
       return { posX, posZ };
    }
   

    cellToPixels(posX, posZ) {
        let x = (this.cellWidth / 2) + (posX * this.cellWidth);
        let z = (this.cellLength / 2) + (posZ * this.cellLength);
        
        return { x, z }
    }

    pixelsToCell(posX, posZ) {
        const gridX = Math.floor(posX / this.cellWidth);
        const gridZ = Math.floor(posZ / this.cellLength);
        return { gridX, gridZ };
    }

    gridDimensions(maze) {
        return [Math.floor(maze.length/2), Math.floor(maze[0].length/2)]
    }
    
    constructGrid(maze, dimensions) {
        const temp = [...Array(dimensions[0])].map(e => Array(dimensions[1]));

        for (let i = 0; i < maze.length - 2; i += 2) {
            for (let j = 0; j < maze[0].length - 2; j += 2) {
                const cell = maze[i][j];

                const v = Math.floor((i + 1) / 2);
                const h = Math.floor((j + 1) / 2);
                temp[v][h] = [];


                if (cell === 'VERTEX') {
                    if (j + 1 < maze[0].length && maze[i][j + 1] !== 'HORIZONTAL') {
                        temp[v][h].push('UP');
                    }
                    if (i + 1 < maze.length && maze[i + 1][j] !== 'VERTICAL') {
                        temp[v][h].push('LEFT');
                    }
                }
                const nextCell = maze[i + 2][j + 2]
                if (nextCell === 'VERTEX') {
                    if (maze[i + 2][j + 1] !== 'HORIZONTAL') {
                        temp[v][h].push('DOWN');
                    }
                    if (maze[i + 1][j + 2] !== 'VERTICAL') {
                        temp[v][h].push('RIGHT');
                    }
                }
            }
        }        
        return temp;
    }

    setEntityOnGrid(entity) {
        const { x, z } = entity.getPosition();        
        const { gridX, gridZ } = this.pixelsToCell(x, z);
        
        entity.cell = [gridZ, gridX];
    }

    checkIfEntitiesShareCell() {
        const user = this.user.cell;
        const minotaur = this.minotaur.cell;
        if(user[0] === minotaur[0] && user[1] === minotaur[1]) {
            this.generateUserPos();
        }
    }

    isPlayerOnPath(prevCell) {
        if (prevCell[0] !== this.user.cell[0] || prevCell[1] !== this.user.cell[1]) {
            if (this.isUserOnPath(this.minotaur.path, this.user.cell)) {
                return;
            }
            this.minotaur.calculatePath(this.user.cell);
        }
    }

    isUserOnPath(path, target){
        for(let i = 0; i < path.length; i ++) {
            if(path[i][0] === target[0] && path[i][1] === target[1]) return true;
        }
    }

    update() {
        this.checkIfEntitiesShareCell();
        const prev = this.user.cell;
        this.setEntityOnGrid(this.user);
        this.setEntityOnGrid(this.minotaur)
        this.isPlayerOnPath(prev);
    }
}