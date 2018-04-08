class GridManager {
    constructor(user, minotaur, maze) {        
        this.user = user;
        this.minotaur = minotaur;
        this.cellWidth = maze.wallLength;
        this.cellLength = maze.wallLength * maze.wallRatio;
        this.wallWidth = maze.wallWidth;
        
    }

    init (maze) {            
        this.grid = this.constructGrid(maze, this.gridDimensions(maze));   
        this.generateMinotaurPos();
        this.generateUserPos()
    }

    generateUserPos() {
        const { posX, posZ } = this.generateGridPosition();
        if (posX === this.minotaurCell[1] && posZ === this.minotaurCell[0]) {
            this.generateUserPos();
            return;
        }       
        const { x, z } = this.cellToPixels(posX, posZ) ;
        this.user.setPosition(x, z);
        this.userCell = [x, z];            
    }

    generateMinotaurPos() {
        const { posX, posZ } = this.generateGridPosition();
        const { x, z } = this.cellToPixels(posX, posZ);
        this.minotaur.setPosition(x, z);
        this.minotaurCell = [posX, posZ] ;
    }

    generateGridPosition() {        
       const posX = Math.floor(Math.random() * Math.floor(this.grid[0].length));
       const posZ = Math.floor(Math.random() * Math.floor(this.grid.length));
       return { posX, posZ };
    }
   

    cellToPixels(posX, posZ) {
        const x = (this.cellWidth / 2) + (posX * this.cellWidth) + this.wallWidth/2;
        const z = (this.cellLength / 2) + (posZ * this.cellLength);

        return { x, z }
    }

    pixelsToCell(posX, posZ) {

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
                    if (j + 1 < maze[0].length && maze[i][j + 1] === 'HORIZONTAL') {
                        temp[v][h].push('UP');
                    }
                    if (i + 1 < maze.length && maze[i + 1][j] === 'VERTICAL') {
                        temp[v][h].push('LEFT');
                    }
                }
                const nextCell = maze[i + 2][j + 2]
                if (nextCell === 'VERTEX') {
                    if (maze[i + 2][j + 1] === 'HORIZONTAL') {
                        temp[v][h].push('DOWN');
                    }
                    if (maze[i + 1][j + 2] === 'VERTICAL') {
                        temp[v][h].push('RIGHT');
                    }
                }
            }
        }
        return temp;
    }


    arrayToPixels(maze) {
        // const realDimensions = [arrayDimensions[0] * this.wallLength, arrayDimensions[1] * this.wallLength * this.wallRatio];
        // Width of cell is 1.3 - 0.2 wide
        // Height of cell is 2.6
        //const realArray = this.constructRealArray(arrayDimensions);
    }

    update() {
        
    }

    render() {
    }
}