import { readInput } from '../utils/functions.js';

const input = readInput();

const lines = input.split('\n');
const depth = parseInt(lines[0].split(' ')[1], 10);
const target = lines[1].substring(8).split(',');
const targetX = parseInt(target[0], 10);
const targetY = parseInt(target[1], 10);
const limitX = 100;
const limitY = 800;

const createMap = (val) => {
  const map = [];
  for (let y = 0; y < limitY; y++) {
    map[y] = [];
    for (let x = 0; x < limitX; x++) {
      map[y][x] = val;
    }
  }
  return map;
};

const geoIdx = createMap(0);
const eroLev = createMap(0);
const type = createMap(0);

for (let y = 0; y < limitY; y++) {
  for (let x = 0; x < limitX; x++) {
    if (y === targetY && x === targetX) {
      geoIdx[y][x] = 0;
    } else if (y === 0) {
      geoIdx[y][x] = x * 16807;
    } else if (x === 0) {
      geoIdx[y][x] = y * 48271;
    } else {
      geoIdx[y][x] = eroLev[y - 1][x] * eroLev[y][x - 1];
    }
    eroLev[y][x] = (geoIdx[y][x] + depth) % 20183;
    type[y][x] = eroLev[y][x] % 3;
  }
}

let risk = 0;
for (let y = 0; y <= targetY; y++) {
  for (let x = 0; x <= targetX; x++) {
    risk += type[y][x];
  }
}

console.log('part1:', risk);

const manhattan = (from, to) =>
  Math.abs(from.row - to.row) + Math.abs(from.col - to.col);

const getOtherTool = (terrain, currentTool) => {
  // rocky
  if (terrain === 0) {
    return currentTool === 0 ? 2 : 0;
  }
  // wet
  if (terrain === 1) {
    return currentTool === 0 ? 1 : 0;
  }
  // narrow
  return currentTool === 1 ? 2 : 1;
};

const isToolAllowed = (tool, terrain) =>
  terrain === tool || (terrain + 2) % 3 === tool;

const getAdjacentSquares = (current) => {
  const adj = [];
  const currTerrain = type[current.row][current.col];
  const testAndAdd = (row, col, tool) => {
    if (row >= 0 && col >= 0 && row < limitY && col < limitX) {
      const terrain = type[row][col];
      if (isToolAllowed(tool, terrain)) {
        adj.push({ row, col, tool });
      }
    }
  };

  testAndAdd(current.row - 1, current.col, current.tool);
  testAndAdd(current.row + 1, current.col, current.tool);
  testAndAdd(current.row, current.col - 1, current.tool);
  testAndAdd(current.row, current.col + 1, current.tool);
  testAndAdd(current.row, current.col, getOtherTool(currTerrain, current.tool));
  return adj;
};

const findPath = (from, to) => {
  const inClosedSet = [createMap(false), createMap(false), createMap(false)];
  const inOpenSet = [createMap(false), createMap(false), createMap(false)];
  const closedSet = [];
  let openSet = [from];
  inOpenSet[from.tool][from.row][from.col] = true;
  const gScore = [
    createMap(Number.MAX_VALUE),
    createMap(Number.MAX_VALUE),
    createMap(Number.MAX_VALUE),
  ];
  gScore[from.tool][from.row][from.col] = 0;
  const fScore = [
    createMap(Number.MAX_VALUE),
    createMap(Number.MAX_VALUE),
    createMap(Number.MAX_VALUE),
  ];
  fScore[from.tool][from.row][from.col] = manhattan(from, to);

  while (openSet.length > 0) {
    let current = null;
    let score = Number.MAX_VALUE;
    for (let i = 0; i < openSet.length; i++) {
      const curr = openSet[i];
      const currentScore = fScore[curr.tool][curr.row][curr.col];
      if (currentScore < score) {
        current = curr;
        score = currentScore;
      }
    }

    if (
      current.row === to.row &&
      current.col === to.col &&
      current.tool === to.tool
    ) {
      return score;
    }

    openSet = openSet.filter(
      (x) =>
        x.row !== current.row ||
        x.col !== current.col ||
        x.tool !== current.tool,
    );
    closedSet.push(current);
    inOpenSet[current.tool][current.row][current.col] = false;
    inClosedSet[current.tool][current.row][current.col] = true;

    const neighbours = getAdjacentSquares(current);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      if (inClosedSet[neighbour.tool][neighbour.row][neighbour.col]) {
        continue;
      }

      let tentativeGScore = gScore[current.tool][current.row][current.col];
      if (neighbour.tool !== current.tool) {
        tentativeGScore += 7;
      } else {
        tentativeGScore += 1;
      }

      if (!inOpenSet[neighbour.tool][neighbour.row][neighbour.col]) {
        openSet.push(neighbour);
      }
      if (
        tentativeGScore >= gScore[neighbour.tool][neighbour.row][neighbour.col]
      ) {
        continue;
      }
      gScore[neighbour.tool][neighbour.row][neighbour.col] = tentativeGScore;
      fScore[neighbour.tool][neighbour.row][neighbour.col] =
        tentativeGScore + manhattan(neighbour, to);
    }
  }
  throw new Error('No path found');
};

console.log(
  'part2:',
  findPath(
    { row: 0, col: 0, tool: 2 },
    { row: targetY, col: targetX, tool: 2 },
  ),
);
