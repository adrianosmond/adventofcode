import readInput from '../utils/readInput.js';
import { inputToCharGrid, strToIntArray } from '../utils/functions.js';

const input = readInput();
const grid = inputToCharGrid(input);

const DIRECTIONS = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };
const MOVEMENTS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const startIdx = grid.flat().findIndex((c) => c === '^');
const startRow = Math.floor(startIdx / grid[0].length);
const startCol = startIdx % grid[0].length;
grid[startRow][startCol] = '.';

const move = (row, col, direction) => {
  let [rDiff, cDiff] = MOVEMENTS[direction];
  while (grid[row + rDiff][col + cDiff] !== '.') {
    direction++;
    direction %= 4;
    [rDiff, cDiff] = MOVEMENTS[direction];
  }
  row += rDiff;
  col += cDiff;
  return [row, col, direction];
};

const notOnGridEdge = (row, col) =>
  row > 0 && row < grid.length - 1 && col > 0 && col < grid[0].length - 1;

const pathHasLoop = () => {
  const path = {};
  let row = startRow;
  let col = startCol;
  let direction = DIRECTIONS.UP;
  do {
    if (path[`${row},${col},${direction}`]) return true;
    path[`${row},${col},${direction}`] = true;
    [row, col, direction] = move(row, col, direction);
  } while (notOnGridEdge(row, col));
  return false;
};

const findVisited = () => {
  const visited = {};
  let row = startRow;
  let col = startCol;
  let direction = DIRECTIONS.UP;
  do {
    visited[`${row},${col}`] = true;
    [row, col, direction] = move(row, col, direction);
  } while (notOnGridEdge(row, col));
  visited[`${row},${col}`] = true;
  return visited;
};

export const part1 = () => Object.keys(findVisited()).length;

export const part2 = () => {
  let loopsFound = 0;
  const path = Object.keys(findVisited());
  path.shift(); // don't check the starting square
  path.forEach((v) => {
    const [r, c] = strToIntArray(v, ',');
    grid[r][c] = '#';
    if (pathHasLoop()) loopsFound++;
    grid[r][c] = '.';
  });
  return loopsFound;
};
