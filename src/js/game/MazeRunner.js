class MazeRunner {

  constructor() {
    this.powerupManager = new PowerupManager();

    this.maze = new Maze();
    this.minimap = new Minimap();
    this.minotaur = new Minotaur(6.6, 7.8);
    this.user = new User(this.maze);

    this.init();
  }

  init() {
    this.user.init();
    this.maze.init('maze.txt');
    this.minimap.init('maze.txt');
    this.minotaur.init();
    this.powerupManager.init();
  }

  update() {
    this.powerupManager.update();
  }

  render() {
    const mv = this.user.render();
    this.minimap.mv = mv.miniMv;

    this.maze.render(mv.mazeMv);
    this.minimap.render(mv.userXPos, mv.userZPos);
    this.minotaur.render(mv.mazeMv);
    this.powerupManager.render(mv.mazeMv);
  }

}