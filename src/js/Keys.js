var keys = [];

const KEY_SPACE = 32;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const KEY_A = 'A'.charCodeAt(0);
const KEY_S = 'S'.charCodeAt(0);
const KEY_D = 'D'.charCodeAt(0);
const KEY_W = 'W'.charCodeAt(0);

function handleKeydown(evt) {
    keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
    keys[evt.keyCode] = false;
}

function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}

function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);