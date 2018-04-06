// /**
//  * The main method that loads everything
//  * once the document is ready.
//  */

var gameManager;

window.onload = function init() {
  const mazeRunner = new MazeRunner();
  gameManager = new GameManager(mazeRunner);

  gameManager.requestNextIteration();

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 'Q'.charCodeAt(0)) {
      gameManager.gameOver();
    }
  });
}
