class Minotaur extends GameItem {

  constructor(x, z) {
    super('../assets/minotaur.ply', 'Stone');

    this.posX = x;
    this.posZ = z;
    this.scaling = 0.3;

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
    let mv = translate(this.posX, this.scaling, this.posZ);
    mv = mult(mv, scalem(this.scaling, this.scaling, this.scaling));

    return mv;
  }
}