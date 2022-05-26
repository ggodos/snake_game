const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const HEIGHT = 600;
const WIDTH = 800;
const PHYS_SPEED = 100;
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
let cellSize;
let cellsHeight;
let cellsWidth;
let snake;
let moveDir = DIR.l;
let canChangeDir = true;
let availableCells;
let wantStart = false;

let gameStarted = false;

ctx.canvas.height = HEIGHT;
ctx.canvas.width = WIDTH;

function startGame() {
  if (gameStarted) {
    return;
  }
  gameStarted = true;
  physLoop();
}

function stopGame() {
  gameStarted = false;
}

function resetGame() {
  stopGame();
  delete snake;
  initGame();
}

function endGame() {
  stopGame();

  alert(endGameMsg);

  resetGame();
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
  let stdMap = Array(cellsHeight);
  stdMap[0] = Array(cellsWidth).fill(1);
  for (let i = 1; i < cellsHeight; i++) {
    stdMap[i] = Array(cellsWidth).fill(0);
    stdMap[i][0] = 1;
    stdMap[i][cellsWidth - 1] = 1;
  }
  stdMap[cellsHeight - 1] = Array(cellsWidth).fill(1);
  return stdMap;
}

function changeCellSize(size) {
  cellSize = size;
  cellsHeight = Math.floor(HEIGHT / cellSize);
  cellsWidth = Math.floor(WIDTH / cellSize);
}

function initSnake() {
  snake = createNode(
    Math.floor(cellsHeight / 2),
    Math.floor(cellsWidth / 2),
    0
  );
}

function initMap() {
  gameMap = getStandartMap();
}

function getElem(el) {
  return { y: el.y, x: el.x };
}

function generateAvaliableCells() {
  let avals = {};
  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
      if (gameMap[y][x] == 0) {
        var el = getElem({ y: y, x: x });
        avals[JSON.stringify(el)] = el;
      }
    }
  }
  availableCells = JSON.stringify(avals);
}

function initGame() {
  initMap();
  initSnake();
  generateAvaliableCells();
  generateFood(1);
}

function drawNode(node, color = nodeColor) {
  ctx.fillStyle = color;
  ctx.fillRect(node.x * cellSize, node.y * cellSize, cellSize, cellSize);
}

function drawHead(color = snakeHeadColor) {
  ctx.fillStyle = color;
  ctx.fillRect(snake.x * cellSize, snake.y * cellSize, cellSize, cellSize);
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
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
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
  snake.x += moveDir.x;
  snake.y += moveDir.y;

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

function generateFood(n = 1) {
  // For now always work for n = 1
  let avals = JSON.parse(availableCells);
  cur = snake;
  while (cur != null) {
    delete avals[getElem(cur)];
    cur = cur.next;
  }

  // Peek random coordinate
  var keys = Object.keys(avals);
  var c = avals[keys[(keys.length * Math.random()) << 0]];
  gameMap[c.y][c.x] = 2;
}

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
  canChangeDir = true;
}

const controller = {
  keyListener: function (e) {
    let nextDir = moveDir;
    switch (e.keyCode) {
      case 37: // left arrow
        if (moveDir != DIR.r) {
          nextDir = DIR.l;
          wantStart = true;
        }
        break;
      case 38: // up arrow
        if (moveDir != DIR.d) {
          nextDir = DIR.u;
          wantStart = true;
        }
        /* wantChangeDir = nextDir != DIR.d; */
        break;
      case 39: // right arrow
        if (moveDir != DIR.l) {
          nextDir = DIR.r;
          wantStart = true;
        }
        break;
      case 40: // down arrow
        if (moveDir != DIR.u) {
          nextDir = DIR.d;
          wantStart = true;
        }
        break;
    }

    if (canChangeDir) {
      canChangeDir = false;
      moveDir = nextDir;
    }
    if (wantStart && !gameStarted) {
      startGame();
      wantStart = false;
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
