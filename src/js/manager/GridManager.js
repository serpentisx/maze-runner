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
        this.minotaur.cell = [posZ, posX] ;
    }

    generateGridPosition() {                
       const posX = Math.floor(Math.random() * Math.floor(this.grid[0].length));
       const posZ = Math.floor(Math.random() * Math.floor(this.grid.length));
       console.log(posZ);
       
       return { posX, posZ };
    }
   

    cellToPixels(posX, posZ) {
        const x = (this.cellWidth / 2) + (posX * this.cellWidth) + this.wallWidth/2;
        const z = (this.cellLength / 2) + (posZ * this.cellLength);

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

    findOnGrid(entity) {
        const { x, z } = entity.getPosition();        
        const { gridX, gridZ } = this.pixelsToCell(x, z);
        
        entity.cell = [gridZ, gridX];
    }


    update() {
        const prev = this.user.cell;
        this.findOnGrid(this.user);
        this.findOnGrid(this.minotaur)
        if(prev[0] !== this.user.cell[0] && prev[1] !== this.user.cell[1]) {            
            this.minotaur.calculatePath(this.user.cell);
            console.log("done");
            console.log(this.minotaur.path);
            
            
        }
    }

    render() {
    }
}