class Teapot extends GameItem {

  constructor(x, z) {
    super('./assets/teapot.ply', 'Gold');

    this.posX = x;
    this.posZ = z;
    this.scaling = 0.08;
    this.recOffset = 0.5;
    this.deltaRot = 0;

    this.texCoords = [
      vec2(0.0, 0.0),
      vec2(100, 0.0),
      vec2(100, 100.0),
      vec2(100, 100.0),
      vec2(0.0, 100.0),
      vec2(0.0, 0.0),
    ];

    this.hasLoaded = false;
  }

  getPositionMatrix() {
    let mv = translate(this.posX, this.scaling + 0.25, this.posZ);
    mv = mult(mv, scalem(this.scaling, this.scaling, this.scaling));
    mv = mult(mv, rotateX(90.0));
    mv = mult(mv, rotateZ(++this.deltaRot % 360));

    return mv;
  }

  handleCollisionWithUser(userX, userZ) {
    const collision = this.checkCollisionWithUser(userX, userZ);
    if (collision) {
      this.isDestroyed = true;
    }
  }

  render(mv, userX, userZ) {
    super.render(mv, userX, userZ);
    this.handleCollisionWithUser(userX, userZ);
  }
}