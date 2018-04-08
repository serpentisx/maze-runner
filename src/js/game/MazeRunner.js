class MazeRunner {

  constructor() {
    this.powerupManager = new PowerupManager();
    this.gridManager = new GridManager();

    this.maze = new Maze();
    this.minimap = new Minimap();
    this.minotaur = new Minotaur(6.6, 7.8);
    this.user = new User(this.maze);

    this.init();
  }

  async init() {
    await this.maze.init('maze.txt');

    console.log(this.maze.hasLoaded); // true
    
    this.minimap.init('maze.txt');
    this.user.init();
    this.gridManager.init(this.maze.mazeArray);
    this.powerupManager.init();
   }

  update() {
    this.powerupManager.update();
    
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl_mini.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const mv = this.user.render();
    this.minimap.mv = mv.miniMv;

    this.maze.render(mv.mazeMv);
    this.minimap.render(mv.userXPos, mv.userZPos);
    this.minotaur.render(mv.mazeMv);
    this.powerupManager.render(mv.mazeMv, mv.userXPos, mv.userZPos);
  }

}