class MazeRunner {

  constructor() {
   this.maze = new Maze();
    this.maze.init('maze.txt');
   this.user = new User();
   this.user.init();   
  }

  init() {
    //event listeners for mouse

  }

  update(du) {
    // console.log('updating');
  }

  render(gl) {    
    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    let mv = this.user.render(gl);;
    this.maze.render(gl, mv);
  }
}
