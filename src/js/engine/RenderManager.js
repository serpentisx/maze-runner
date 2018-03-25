//For rendering

class RenderManager {

  constructor(renderer) {

    this.renderer = renderer;
    this.doClear = true;
    this.doRender = true;
    this.frameCounter = 1;
  }

  render(ctx) {
    if (this.doClear) Utils.clearCanvas(ctx);
    if (this.doRender) this.renderer(ctx);

    this.frameCounter++;
  }
}
