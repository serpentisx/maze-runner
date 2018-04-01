//For rendering

class RenderManager {

  constructor(renderer) {

    this.renderer = renderer;
    this.doClear = true;
    this.doRender = true;
    this.frameCounter = 1;
  }

  render(gl) {

    if (this.doClear) gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (this.doRender) this.renderer(gl);

    this.frameCounter++;
  }
}
