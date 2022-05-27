apple = new Image();
apple.src = "assets/apple.png";

function drawNode(node, color = NODE_COLOR) {
  ctx.fillStyle = color;
  ctx.fillRect(node.x * cellSize, node.y * cellSize, cellSize, cellSize);
}

function drawHead(color = SNAKE_HEAD_COLOR) {
  ctx.fillStyle = color;
  ctx.fillRect(snake.x * cellSize, snake.y * cellSize, cellSize, cellSize);
}

function drawBackground() {
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawSnake(color = SNAKE_COLOR) {
  let cur = snake.next;
  i = 0;
  while (cur != null) {
    drawNode(cur, color);
    i++;
    cur = cur.next;
  }
  drawHead();
}

function drawCell(y, x) {
  ctx.fillStyle = "#282a36";
  switch (gameMap[y][x]) {
    case WALL:
      ctx.fillStyle = WALL_COLOR;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      break;

    case FOOD:
      ctx.drawImage(apple, x * cellSize, y * cellSize);
    /* ctx.fillStyle = FOOD_COLOR;
     * ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize); */
    default:
      break;
  }
}

function drawMap() {
  for (let y = 0; y < gameMap.length; y++) {
    for (let x = 0; x < gameMap[y].length; x++) {
      drawCell(y, x);
    }
  }
}
