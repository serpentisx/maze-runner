//For rendering

class RenderManager {

  constructor(renderer) {

    this.renderer = renderer;
    this.doClear = true;
    this.doRender = true;
    this.frameCounter = 1;
  }

  render() {
    if (this.doRender) this.renderer();

    this.frameCounter++;
  }
}
