class PowerupManager {

  constructor() {
    this.powerups = [];
  }

  init() {
    this.powerups.push(
      new Teapot(4.6, 7.8),
      new Teapot(4.6, 5.8)
    );

    this.powerups.forEach(powerup => powerup.init());
  }

  update() {
    for (let i = 0; i < this.powerups.length; i++) {
      if (this.powerups[i].isDestroyed) {
        this.powerups.splice(i--, 1);
      }
    }
  }

  render(mv) {
    this.powerups.forEach(powerup => powerup.render(mv));
  }
}