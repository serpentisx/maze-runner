class MazeRunner {

  constructor() {
    this.maze = new Maze();
    this.minimap = new Minimap();
    this.user = new User(this.maze);

    this.user.init();
    this.maze.init('maze.txt');
    this.minimap.init('maze.txt');
  }

  init() {
    //event listeners for mouse

  }

  update(du) {
    // console.log('updating');
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl_mini.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const mv = this.user.render();

    this.maze.render(mv.mazeMv);
    this.minimap.render(mv.miniMv);
  }
}