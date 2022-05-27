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
