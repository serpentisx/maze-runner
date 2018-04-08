class GridManager {
    constructor() {
    }

    init (maze) {      
      this.grid = this.constructGrid(maze);
    }

    
    arrayToPixels(maze) {
       // const realDimensions = [arrayDimensions[0] * this.wallLength, arrayDimensions[1] * this.wallLength * this.wallRatio];
        // Width of cell is 1.3 - 0.2 wide
        // Height of cell is 2.6
        //const realArray = this.constructRealArray(arrayDimensions);
    }

    constructGrid(dimensions) {
        const temp = [...Array(dimensions[0])].map(e => Array(dimensions[1]));

        for (let i = 0; i < this.mazeArray.length - 2; i += 2) {
            for (let j = 0; j < this.mazeArray[0].length - 2; j += 2) {
                const cell = this.mazeArray[i][j];

                const v = Math.floor((i + 1) / 2);
                const h = Math.floor((j + 1) / 2);
                temp[v][h] = [];


                if (cell === 'VERTEX') {
                    if (j + 1 < this.mazeArray[0].length && this.mazeArray[i][j + 1] === 'HORIZONTAL') {
                        temp[v][h].push('UP');
                    }
                    if (i + 1 < this.mazeArray.length && this.mazeArray[i + 1][j] === 'VERTICAL') {
                        temp[v][h].push('LEFT');
                    }
                }
                const nextCell = this.mazeArray[i + 2][j + 2]
                if (nextCell === 'VERTEX') {
                    if (this.mazeArray[i + 2][j + 1] === 'HORIZONTAL') {
                        temp[v][h].push('DOWN');
                    }
                    if (this.mazeArray[i + 1][j + 2] === 'VERTICAL') {
                        temp[v][h].push('RIGHT');
                    }
                }
            }
        }
        return temp;
    }

    

    update() {

    }

    render() {
    }
}