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

  alert(loseMsg);
  console.log(loseMsg);

  resetGame();
}

function winGame() {
  stopGame();

  alert(winMsg);
  console.log(winMsg);

  resetGame();
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

function initGame() {
  initMap();
  initSnake();
  genStartAvaliableCells();
  let avals = getAvaliableCells();
  generateFood(avals, 1);
}

function growSnake(x, y) {
  tail = snake;
  while (tail.next != null) {
    tail = tail.next;
  }
  tail.next = createNode(y, x, tail.n + 1);
  tail.next.prev = tail;
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

function generateFood(avals, n = 1) {
  // For now always work for n = 1

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
    let avals = getAvaliableCells();
    if (Object.keys(avals).length == 0) {
      winGame();
      return;
    }
    generateFood(avals);
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
