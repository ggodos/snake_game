const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 800;
const HEIGHT = 720;
const PHYS_SPEED = 500;
const DIR = {
  r: { y: 0, x: 1 },
  l: { y: 0, x: -1 },
  u: { y: -1, x: 0 },
  d: { y: 1, x: 0 },
};
const EMPTY = 0;
const WALL = 1;
const FOOD = 2;
const NODE_COLOR = "#bd9cf9";
const BACKGROUND_COLOR = "#282a36";
const SNAKE_HEAD_COLOR = "#ff5555";
const SNAKE_COLOR = "green";
const WALL_COLOR = "#57c7ff";
const FOOD_COLOR = "red";

const loseMsg = "You lose.";
const winMsg = "At the end all roads lead to death.";

let gameMap;
let cellSize;
let cellsHeight;
let cellsWidth;
let snake;
let moveDir;
let canChangeDir = true;
let availableCells;
let wantStart = false;

let gameStarted = false;

function drawLoop() {
  drawBackground();
  drawMap();
  drawSnake();
  window.requestAnimationFrame(drawLoop);
}

function physLoop() {
  setTimeout(function () {
    // Check some

    calcTurn();

    if (gameStarted) {
      physLoop();
    }
  }, PHYS_SPEED);
}

ctx.canvas.height = HEIGHT;
ctx.canvas.width = WIDTH;

changeCellSize(40);
initGame();

window.addEventListener("keydown", controller.keyListener);
window.requestAnimationFrame(drawLoop);
