class MazeRunner {

  constructor() {
    this.hasLoaded = false;
    this.powerupManager = new PowerupManager();

    this.maze = new Maze();
    this.minimap = new Minimap();
    this.minotaur = new Minotaur();
    this.user = new User(this.maze);
    
    this.gridManager = new GridManager(this.user, this.minotaur, this.maze);

    this.init();
  }

  async init() {
    await this.maze.init('maze.txt');
    this.minimap.init('maze.txt');
    this.gridManager.init(this.maze.mazeArray);

    this.powerupManager.init();
    this.minotaur.init();
    this.user.init();
    this.hasLoaded = true;
   }

  update() {
    this.powerupManager.update();
    this.gridManager.update();
    
  }

  render() {
    if(!this.hasLoaded) return;
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