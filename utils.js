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
  cellSize = size;
  cellsHeight = Math.floor(HEIGHT / cellSize);
  cellsWidth = Math.floor(WIDTH / cellSize);
}

function getElem(el) {
  return { y: el.y, x: el.x };
}

function genStartAvaliableCells() {
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

function getAvaliableCells() {
  let avals = JSON.parse(availableCells);
  cur = snake;
  while (cur != null) {
    let el = getElem(cur);
    delete avals[JSON.stringify(el)];
    cur = cur.next;
  }
  return avals;
}
