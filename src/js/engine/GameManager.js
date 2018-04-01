"use strict";

window.requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

class GameManager {

  constructor(game) {    
    this.gl = gl;
    this.renderManager = new RenderManager(game.render.bind(game));
    this.updateManager = new UpdateManager(game.update.bind(game));

    this.isGameOver = false;
    this.frameTime_ms = null;
    this.frameTimeDelta_ms = null;
  }

  iter(frameTime) {
    this.updateClocks(frameTime);
    this.iterCore(this.frameTimeDelta_ms);

    if (!this.isGameOver) this.requestNextIteration();
  }

  updateClocks(frameTime) {
    if (this.frameTime_ms === null) this.frameTime_ms = frameTime;

    this.frameTimeDelta_ms = frameTime - this.frameTime_ms;
    this.frameTime_ms = frameTime;
  }

  iterCore(dt) {
    if (this.requestedQuit()) {
      this.gameOver();
      return;
    }

    this.updateManager.update(dt);
    this.renderManager.render(this.gl);
  }

  gameOver() {
    this.isGameOver = true;
    console.log("gameOver: quitting...");
  }

  requestedQuit() {
    return this.isGameOver;
  }

  mainIterFrame(frameTime) {
    this.iter(frameTime);
  }

  mainIterFrame(frameTime) {
    this.iter(frameTime);
  }

  requestNextIteration() {
    window.requestAnimationFrame(this.mainIterFrame.bind(this));
  }

  start() {
    this.requestNextIteration();
  }
}