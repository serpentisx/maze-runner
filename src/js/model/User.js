var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

class User {

  constructor(prop) {
    this.mazeGl = gl;
    this.minimapGl = gl_mini;

    this.userIncr = 0.1;                // Size of forward/backward step
    this.userAngle = 270.0;             // Direction of the user in degrees
    this.userXDir = 0.0;                // X-coordinate of heading
    this.userZDir = -1.0;               // Z-coordinate of heading

    this.wallOffset = 0.22;
    this.maze = prop.maze;
    this.minotaur = prop.minotaur;
  
    this.showMinotaur = false;
    this.viewY = 10;
    
  }

  // Initialise event listeners for user movement
  init(grid) {        
    this.gridManager = grid;

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
      this.handleTeleport(e);
      this.handleMovement(e);
      this.handleShowMinotaur(e);
    }.bind(this));

    this.hasLoaded = true;
  }

  handleMovement(e) {
    if (this.maze.hasLoaded) {
      let tmpx = this.userXPos;
      let tmpz = this.userZPos;

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

      if (!collision) {
        this.userXPos = tmpx;
        this.userZPos = tmpz;
      }
    }
  }

  handleShowMinotaur(e) {
    const num = document.getElementById('countApple');

    if (num) {
      if (e.keyCode === 50 || e.keyCode === 98) { // 2 or numpad 2
        const count = parseInt(num.innerHTML.match(/\d+/)[0]) - 1;
        if (count === 0) {
          document.querySelector('.showmap').remove();
        }
        else {
          num.innerHTML = `(${count})x`;
        }
        this.showMinotaur = true;

        setTimeout(() => {
          this.showMinotaur = false;
        }, 10000);
        
      }
    }
  }

  handleTeleport(e) {
    const num = document.getElementById('count');

    if (num) {
      if (e.keyCode === 49 || e.keyCode === 97) { // 1 or numpad 1
        const count = parseInt(num.innerHTML.match(/\d+/)[0]) - 1;
        if (count === 0) {
          document.querySelector('.teleport').remove();
        }
        else {
          num.innerHTML = `(${count})x`;
        }

        this.gridManager.generateMinotaurPos();
      }
    }
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

  setPosition(x, z) {
    this.userXPos = x;
    this.userZPos = z;
  }

  getPosition() {
    return this.userXPos, this.userZPos;
  }

  checkIsShowingMinotaur() {
    if (this.showMinotaur) {
      if (this.viewY <= 25) {
        this.viewY += 0.08;
      }
      return this.minotaur;
    }
    this.viewY = 10;

    return false;
  }

  render() {
    const minotaur = this.checkIsShowingMinotaur();
      
    const mazeMv = lookAt(vec3(this.userXPos, 0.5, this.userZPos), vec3(this.userXPos + this.userXDir, 0.5, this.userZPos + this.userZDir), vec3(0.0, 1.0, 0.0));
    const miniMv = lookAt(vec3(this.userXPos, this.viewY, this.userZPos), vec3(this.userXPos + this.userXDir, 0.5, this.userZPos + this.userZDir), vec3(0.0, 1, 0.0));
    
    this.mazeGl.uniformMatrix4fv(mvLoc, false, flatten(mazeMv));
    this.minimapGl.uniformMatrix4fv(mvLoc_mini, false, flatten(miniMv));

    return { mazeMv, miniMv, userXPos: this.userXPos, userZPos: this.userZPos, minotaur };
  }
}