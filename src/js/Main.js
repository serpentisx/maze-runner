// /**
//  * The main method that loads everything
//  * once the document is ready.
//  */

window.onload = function init() {
  const mazeRunner = new MazeRunner();
  const gameManager = new GameManager(mazeRunner);

  gameManager.requestNextIteration();

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 'Q'.charCodeAt(0)) {
      gameManager.gameOver();
    }
  });
}
