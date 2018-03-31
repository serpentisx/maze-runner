class Maze {

    constructor(mazeFile) {
        const fileLoc = `assets/${mazeFile}`;
        this.mazeArray = [];
        
        fetch(fileLoc)
            .then(res => res.text())
            .then(data => this.constructArray(data))
            .then(() => console.log(this.mazeArray))

    }

    init() {
        this.hasLoaded = true;
    }

    constructArray(textFile) {
        const lines = textFile.split('\n');
        for( let i = 0; i < lines.length; i += 1 ) {
            const line = lines[i];
            this.mazeArray[i] = [];
            for (let j = 0; j < line.length; j += 1) {
                const symbol = line[j];
                switch (symbol) {
                    case ' ':
                        this.mazeArray[i].push(0);
                        break;
                    case '+':                        
                        this.mazeArray[i].push(1)
                        break;
                    case '-':
                        this.mazeArray[i].push(2)
                        break;
                    case '|':
                        this.mazeArray[i].push(3);
                        break;
                }
            }
        }
    }



    render(ctx) {

    }

}