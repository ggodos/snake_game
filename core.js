const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const HEIGHT = 600;
const WIDTH = 800;
const PHYS_SPEED = 25;
const DIR = {
  r: { y: 0, x: 1 },
  l: { y: 0, x: -1 },
  u: { y: -1, x: 0 },
  d: { y: 1, x: 0 },
};

const controller = {
  keyListener: function (event) {
    switch (event.keyCode) {
      case 37: // left key
        move_dir = DIR.l;
        break;
      case 38: // up key
        move_dir = DIR.u;
        break;
      case 39: // right key
        move_dir = DIR.r;
        break;
      case 40: // down key
        move_dir = DIR.d;
        break;
    }
  },
};

let gameMap;
let CELL_SIZE;
let CELLS_H;
let CELLS_W;
let snake;
let move_dir = DIR.r;

let gameStarted = false;

ctx.canvas.height = HEIGHT;
ctx.canvas.width = WIDTH;

function startGame() {
  gameStarted = true;
  physLoop();
}

function stopGame() {
  gameStarted = false;
}

function createNode(y, x, n) {
  return {
    n: n,
    x: x,
    y: y,
    next: null,
    prev: null,
  };
}

function changeCellSize(size) {
  CELL_SIZE = size;
  CELLS_H = Math.floor(HEIGHT / CELL_SIZE);
  CELLS_W = Math.floor(WIDTH / CELL_SIZE);
}

function initSnake() {
  snake = createNode(1, 4, 0);
  growSnake(0, 4);
  growSnake(0, 3);
  growSnake(0, 2);
  growSnake(1, 2);
  growSnake(1, 1);
}

function initGame() {
  gameMap = Array(CELLS_H);
  for (let i = 0; i < CELLS_H; i++) {
    gameMap[i] = Array(CELLS_W).fill(0);
  }
  initSnake();
}

function drawNode(node, color = "#bd9cf9") {
  ctx.fillStyle = color;
  ctx.fillRect(node.x * CELL_SIZE, node.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawBack() {
  ctx.fillStyle = "#282a36";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawSnake(color = "green") {
  drawNode(snake, "#ff5555");
  let cur = snake.next;
  i = 0;
  while (cur != null) {
    drawNode(cur, color);
    i++;
    cur = cur.next;
  }
}

function growSnake(x, y) {
  tail = snake;
  while (tail.next != null) {
    tail = tail.next;
  }
  tail.next = createNode(x, y, tail.n + 1);
  tail.next.prev = tail;
}

function drawLoop() {
  drawBack();
  drawSnake();
  window.requestAnimationFrame(drawLoop);
}

function calcTurn() {
  let x1 = snake.x,
    y1 = snake.y;
  let x2, y2;
  cur = snake.next;
  snake.x += move_dir.x;
  snake.y += move_dir.y;

  while (cur.next != null) {
    x2 = cur.x;
    y2 = cur.y;
    cur.x = x1;
    cur.y = y1;
    cur = cur.next;
    x1 = x2;
    y1 = y2;
  }
  cur.x = x1;
  cur.y = y1;
}

function physLoop() {
  setTimeout(function () {
    // Check some

    console.log("Calculated");
    calcTurn();

    if (gameStarted) {
      physLoop();
    }
  }, PHYS_SPEED);
}

changeCellSize(10);
initGame();

window.addEventListener("keyleft", controller.keyListener);
window.addEventListener("keyright", controller.keyListener);
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(drawLoop);
