var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

class User {

    constructor() {
        this.userXPos = 3.5;                // Initial position of user
        this.userZPos = 9.0;                //   in (x, z) coordinates, y is fixed
        this.userIncr = 0.1;                // Size of forward/backward step
        this.userAngle = 270.0;             // Direction of the user in degrees
        this.userXDir = 0.0;                // X-coordinate of heading
        this.userZDir = -1.0;               // Z-coordinate of heading
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
            switch (e.keyCode) {
                case 87:	// w
                    this.userXPos += this.userIncr * this.userXDir;
                    this.userZPos += this.userIncr * this.userZDir;;                    
                    break;
                case 83:	// s
                    this.userXPos -= this.userIncr * this.userXDir;
                    this.userZPos -= this.userIncr * this.userZDir;;
                    break;
                case 65:	// a
                    this.userXPos += this.userIncr * this.userZDir;
                    this.userZPos -= this.userIncr * this.userXDir;;
                    break;
                case 68:	// d
                    this.userXPos -= this.userIncr * this.userZDir;
                    this.userZPos += this.userIncr * this.userXDir;;
                    break;
            }
        }.bind(this));
        this.hasLoaded = true;
    }


    render(gl) {
        const mv = lookAt(vec3(this.userXPos, 0.5, this.userZPos), vec3(this.userXPos + this.userXDir, 0.5, this.userZPos + this.userZDir), vec3(0.0, 1.0, 0.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        return mv;
    }

}