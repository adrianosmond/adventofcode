import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';
import {
  inputToCharGrid,
  getNeighbours,
  strToIntArray,
} from '../utils/functions.js';

const input = readInput();
const grid = inputToCharGrid(input);

const path = {};
const findPath = () => {
  const startIdx = grid.flat().indexOf('S');
  const startRow = Math.floor(startIdx / grid[0].length);
  const startCol = startIdx % grid[0].length;
  grid[startRow][startCol] = '.';

  const endIdx = grid.flat().indexOf('E');
  const endRow = Math.floor(endIdx / grid[0].length);
  const endCol = endIdx % grid[0].length;
  grid[endRow][endCol] = '.';

  const queue = [[startRow, startCol]];
  path[`${startRow},${startCol}`] = 0;

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    if (row === endRow && col === endCol) return;

    const distance = path[`${row},${col}`];
    getNeighbours(grid, row, col).forEach(([r, c, cell]) => {
      if (cell === '#') return;
      if (path[`${r},${c}`] >= 0) return;
      path[`${r},${c}`] = distance + 1;
      queue.push([r, c]);
    });
  }
};

const isInGridBounds = (row, col) =>
  row >= 0 && col >= 0 && row < grid.length && col < grid[0].length;

const canCheatTo = (row, col) =>
  isInGridBounds(row, col) && grid[row][col] !== '#';

const findCheatPoints = (row, col, maxCheatDistance, minCheatSaving) => {
  const distance = path[`${row},${col}`];
  let possibleCheats = 0;
  for (let r = row - maxCheatDistance; r <= row + maxCheatDistance; r++) {
    const rowDiff = Math.abs(row - r);
    // Don't bother checking cols where the manhattan distance will be > maxCheatDistance
    const maxColDiff = maxCheatDistance - rowDiff;
    for (let c = col - maxColDiff; c <= col + maxColDiff; c++) {
      if (canCheatTo(r, c)) {
        const distanceFromStart = rowDiff + Math.abs(col - c);
        const cheatEndPosition = path[`${r},${c}`];
        if (cheatEndPosition - distance - distanceFromStart >= minCheatSaving) {
          possibleCheats++;
        }
      }
    }
  }
  return possibleCheats;
};

const checkPathForCheatPoints = (maxCheatDistance, minCheatSaving) => {
  if (Object.keys(path).length === 0) findPath();
  return Object.keys(path)
    .map((k) => {
      const [row, col] = strToIntArray(k, ',');
      return findCheatPoints(row, col, maxCheatDistance, minCheatSaving);
    })
    .reduce(sum);
};

export const part1 = (minCheatSaving = 100) =>
  checkPathForCheatPoints(2, minCheatSaving);

export const part2 = (minCheatSaving = 100) =>
  checkPathForCheatPoints(20, minCheatSaving);
