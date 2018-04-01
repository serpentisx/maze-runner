class User {

    constructor() {
        this.userXPos = 0.0;                // Initial position of user
        this.userZPos = 5.0;                //   in (x, z) coordinates, y is fixed
        this.userIncr = 0.1;                // Size of forward/backward step
        this.userAngle = 270.0;             // Direction of the user in degrees
        this.userXDir = 0.0;                // X-coordinate of heading
        this.userZDir = -1.0;               // Z-coordinate of heading
    }

    init() {
        this.hasLoaded = true;
    }


    render(ctx) {

    }

}