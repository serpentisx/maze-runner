class Apple extends GameItem {

  constructor(x, z) {
    super('./assets/apple.ply', 'Gold');

    this.posX = x;
    this.posZ = z;
    this.scaling = 0.08;
    this.recOffset = 0.40;
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
    mv = mult(mv, rotateY(++this.deltaRot % 360));

    return mv;
  }

  handleCollisionWithUser(userX, userZ) {
    const collision = this.checkCollisionWithUser(userX, userZ);
    if (collision) {
      this.addPoweruptoGame();
      this.isDestroyed = true;
    }
  }

  addPoweruptoGame() {
    const div = document.createElement('div');
    const num = document.getElementById('countApple');

    if (num) {
      const count = parseInt(num.innerHTML.match(/\d+/)[0]) + 1;
      num.innerHTML = `(${count})x`;

      return;
    }

    div.className = 'powerup__item showmap';

    div.innerHTML =
      `<img src="assets/location.png" />\
       <p>Show location</p>\
       <p id="countApple">(1x)</p>`

    document.querySelector('.powerup__container').appendChild(div);
  }

  render(mv, userX, userZ) {
    super.render(mv, userX, userZ);
    this.handleCollisionWithUser(userX, userZ);
  }
}