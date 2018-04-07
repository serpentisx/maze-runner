var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

class User {

  constructor(maze) {
    this.mazeGl = gl;
    this.minimapGl = gl_mini;

    this.userXPos = 4.8;                // Initial position of user
    this.userZPos = 10;                //   in (x, z) coordinates, y is fixed
    this.userIncr = 0.1;                // Size of forward/backward step
    this.userAngle = 270.0;             // Direction of the user in degrees
    this.userXDir = 0.0;                // X-coordinate of heading
    this.userZDir = -1.0;               // Z-coordinate of heading

    this.wallOffset = 0.22;
    this.maze = maze;
  }

  // Initialise event listeners for user movement
  init() {        
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        origX = e.clientX;
    }.bind(this));

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    }.bind(this));

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            this.userAngle += 0.4 * (origX - e.clientX);
            this.userAngle %= 360.0;
            this.userXDir = Math.cos(radians(this.userAngle));
            this.userZDir = Math.sin(radians(this.userAngle));
            origX = e.clientX;
        }
    }.bind(this));

    window.addEventListener("keydown", function (e) {
        
        if (this.maze.hasLoaded) {
          let tmpx;
          let tmpz;

          switch (e.keyCode) {
            case 87:	// w
              tmpx = this.userXPos + this.userIncr * this.userXDir;
              tmpz = this.userZPos + this.userIncr * this.userZDir;
              break;
            case 83:	// s
              tmpx = this.userXPos - this.userIncr * this.userXDir;
              tmpz = this.userZPos - this.userIncr * this.userZDir;
              break;
            case 65:	// a
              tmpx = this.userXPos + this.userIncr * this.userZDir;
              tmpz = this.userZPos - this.userIncr * this.userXDir;
              break;
            case 68:	// d
              tmpx = this.userXPos - this.userIncr * this.userZDir;
              tmpz = this.userZPos + this.userIncr * this.userXDir;
              break;
          }

          const collision = this.collidesWithMaze(tmpx, tmpz);

         // console.log(this.userXPos, this.userXPos);
          

          //console.log(tmpx + this.userXDir * this.maze.wallWidth, tmpz + this.userZDir * this.maze.wallWidth, collision);

          if (!collision) {
            this.userXPos = tmpx;
            this.userZPos = tmpz;
          }
          }
      
    }.bind(this));
    this.hasLoaded = true;
  }

  collidesWithMaze(nextX, nextZ) {
    for (let i = 0; i < this.maze.wallCoords.length; i++) {
      const wall = this.maze.wallCoords[i];
      const collision = Utils.pointInsideRectangle({
        x: nextX,
        y: nextZ
      }, wall, this.wallOffset);

      if (collision) {
        return true;
      }
    }
    return false;
  }


  render() {
    const mazeMv = lookAt(vec3(this.userXPos, 0.5, this.userZPos), vec3(this.userXPos + this.userXDir, 0.5, this.userZPos + this.userZDir), vec3(0.0, 1.0, 0.0));
    const miniMv = lookAt(vec3(this.userXPos, 10, this.userZPos), vec3(this.userXPos + this.userXDir, 0.5, this.userZPos + this.userZDir), vec3(0.0, 1, 0.0));
    
    this.mazeGl.uniformMatrix4fv(mvLoc, false, flatten(mazeMv));
    this.minimapGl.uniformMatrix4fv(mvLoc_mini, false, flatten(miniMv));

    return { mazeMv, miniMv, userXPos: this.userXPos, userZPos: this.userZPos };
  }
}