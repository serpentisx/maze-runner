/**
 * The main method that loads everything
 * once the document is ready.
 */

window.onload = function () {
	//Set canvas size
  ctx.canvas.width  = 920;
  ctx.canvas.height = 700;

  const mazeRunner = new MazeRunner();
  const gameManager = new GameManager(mazeRunner);

	gameManager.requestNextIteration();
};
