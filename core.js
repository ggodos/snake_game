const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const HEIGHT = 600;
const WIDTH = 800;
const PHYS_SPEED = 250;
const DIR = {
  r: { y: 0, x: 1 },
  l: { y: 0, x: -1 },
  u: { y: -1, x: 0 },
  d: { y: 1, x: 0 },
};
const EMPTY = 0;
const WALL = 1;
const FOOD = 2;
const nodeColor = "#bd9cf9";
const backgroundColor = "#282a36";
const snakeHeadColor = "#ff5555";
const snakeColor = "green";

const endGameMsg = "YOU LOSE";

let gameMap;
let CELL_SIZE;
let CELLS_H;
let CELLS_W;
let snake;
let move_dir = DIR.l;
let availableCells = Array();

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

function endGame() {
  gameStarted = false;
  console.log(endGameMsg);
  alert(endGameMsg);
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

function getStandartMap() {
  // Create walled map
  let stdMap = Array(CELLS_H);
  stdMap[0] = Array(CELLS_W).fill(1);
  for (let i = 1; i < CELLS_H; i++) {
    stdMap[i] = Array(CELLS_W).fill(0);
    stdMap[i][0] = 1;
    stdMap[i][CELLS_W - 1] = 1;
  }
  stdMap[CELLS_H - 1] = Array(CELLS_W).fill(1);
  return stdMap;
}

function changeCellSize(size) {
  CELL_SIZE = size;
  CELLS_H = Math.floor(HEIGHT / CELL_SIZE);
  CELLS_W = Math.floor(WIDTH / CELL_SIZE);
}

function initSnake() {
  snake = createNode(Math.floor(CELLS_H / 2), Math.floor(CELLS_W / 2), 0);
}

function initMap() {
  gameMap = getStandartMap();
}

function initGame() {
  initMap();
  initSnake();
  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
      if (gameMap[y][x] == 0) {
        availableCells.push({ y: y, x: x });
      }
    }
  }
  availableCells.sort();
}

function drawNode(node, color = nodeColor) {
  ctx.fillStyle = color;
  ctx.fillRect(node.x * CELL_SIZE, node.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawHead(color = snakeHeadColor) {
  ctx.fillStyle = snakeHeadColor;
  ctx.fillRect(snake.x * CELL_SIZE, snake.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawBackground() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawSnake(color = snakeColor) {
  let cur = snake.next;
  i = 0;
  while (cur != null) {
    drawNode(cur, color);
    i++;
    cur = cur.next;
  }
  drawHead();
}

function growSnake(x, y) {
  tail = snake;
  while (tail.next != null) {
    tail = tail.next;
  }
  tail.next = createNode(y, x, tail.n + 1);
  tail.next.prev = tail;
}

function drawCell(y, x) {
  ctx.fillStyle = "#282a36";
  switch (gameMap[y][x]) {
    case WALL:
      ctx.fillStyle = "blue";
      break;

    case FOOD:
      ctx.fillStyle = "red";
    default:
      break;
  }
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawMap() {
  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
      drawCell(y, x);
    }
  }
}

function drawLoop() {
  drawBackground();
  drawMap();
  drawSnake();
  window.requestAnimationFrame(drawLoop);
}

function isDie() {
  if (gameMap[snake.y][snake.x] == 1) {
    return true;
  }

  cur = snake.next;
  while (cur != null) {
    if (snake.x == cur.x && snake.y == cur.y) {
      return true;
    }
    cur = cur.next;
  }
  return false;
}

function isSnakeEat() {
  return gameMap[snake.y][snake.x] == FOOD;
}

function snakeMove() {
  let x = snake.x,
    y = snake.y;
  cur = snake.next;
  snake.x += move_dir.x;
  snake.y += move_dir.y;

  let tx = x,
    ty = y;
  while (cur != null) {
    tx = cur.x;
    ty = cur.y;
    cur.x = x;
    cur.y = y;
    cur = cur.next;
    x = tx;
    y = ty;
  }
  return { x: x, y: y };
}

function generateFood(n = 1) {}

function calcTurn() {
  let tail = snakeMove();
  if (isDie()) {
    endGame();
  }
  if (isSnakeEat()) {
    growSnake(tail.x, tail.y);
    gameMap[snake.y][snake.x] = 0;
    generateFood(1);
  }
}

const controller = {
  keyListener: function (e) {
    switch (e.keyCode) {
      case 13: // enter
        if (!gameStarted) {
          startGame();
        } else {
          stopGame();
        }
        break;
      case 37: // left key
        if (move_dir != DIR.r) {
          move_dir = DIR.l;
        }
        break;
      case 38: // up key
        if (move_dir != DIR.d) {
          move_dir = DIR.u;
        }
        break;
      case 39: // right key
        if (move_dir != DIR.l) {
          move_dir = DIR.r;
        }
        break;
      case 40: // down key
        if (move_dir != DIR.u) {
          move_dir = DIR.d;
        }
        break;
    }
  },
};

function physLoop() {
  setTimeout(function () {
    // Check some

    calcTurn();

    if (gameStarted) {
      physLoop();
    }
  }, PHYS_SPEED);
}

changeCellSize(20);
initGame();

window.addEventListener("keydown", controller.keyListener);
window.requestAnimationFrame(drawLoop);
