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
    this.maze.gl.clear(this.maze.gl.COLOR_BUFFER_BIT | this.maze.gl.DEPTH_BUFFER_BIT);
    this.minimap.gl.clear(this.minimap.gl.COLOR_BUFFER_BIT | this.minimap.gl.DEPTH_BUFFER_BIT);

    const mv = this.user.render();
    this.minimap.mv = mv.miniMv;

    this.maze.render(mv.mazeMv);
    this.minimap.render(mv.userXPos, mv.userZPos);
  }
}