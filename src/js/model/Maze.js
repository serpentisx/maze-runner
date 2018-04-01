class Maze {

    constructor() {
 
    }
    
    init(mazeFile) {
        const fileLoc = `assets/${mazeFile}`;
        this.mazeArray = [];

        fetch(fileLoc)
            .then(res => res.text())
            .then(data => this.constructArray(data))
            .then(() => console.log(this.mazeArray))



        this.hasLoaded = true;
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



    render(gl, mv) {
        const mv1 = mv;
        // Teikna gólf með mynstri
        gl.bindTexture(gl.TEXTURE_2D, texGolf);
        gl.drawArrays(gl.TRIANGLES, numVertices, numVertices);

        // Teikna loft með mynstri
        gl.bindTexture(gl.TEXTURE_2D, texLoft);
        mv = mult(mv, translate(0.0, 1.0, 0.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.TRIANGLES, numVertices, numVertices);

        // Teikna framvegg með mynstri
        mv = mv1;
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.bindTexture(gl.TEXTURE_2D, texVegg);
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);

        // Teikna bakvegg með mynstri
        mv = mult(mv, translate(0.0, 0.0, 10.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);

        // Teikna hliðarvegg með mynstri
        mv = mv1;
        mv = mult(mv, translate(5.0, 0.0, 5.0));
        mv = mult(mv, rotateY(90.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);

        // Teikna hliðarvegg með mynstri
        mv = mv1;
        mv = mult(mv, translate(-5.0, 0.0, 5.0));
        mv = mult(mv, rotateY(-90.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    }

}