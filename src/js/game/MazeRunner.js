class MazeRunner {

  constructor() {
    this.maze = new Maze();
    this.user = new User(this.maze);
    this.user.init();

    this.maze.init('maze.txt', this.user.render(gl));
  }

  init() {
    //event listeners for mouse

  }

  update(du) {
    // console.log('updating');
  }

  render(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    let mv = this.user.render(gl);
    this.maze.render(gl, mv);
  }
}