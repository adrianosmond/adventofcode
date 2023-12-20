import readInput from '../utils/readInput.js';
import {
  getNeighboursWithDiagonals,
  splitAndMapInputLines,
} from '../utils/functions.js';

const input = readInput();

const makeGrid = () => splitAndMapInputLines(input, '', (c) => c === '#');

const makeNextGrid = (current, next) => {
  for (let row = 0; row < current.length; row++) {
    for (let col = 0; col < current[row].length; col++) {
      const numNeighboursOn = getNeighboursWithDiagonals(
        current,
        row,
        col,
      ).filter(([, , val]) => val).length;

      next[row][col] =
        numNeighboursOn === 3 || (current[row][col] && numNeighboursOn === 2);
    }
  }
};

const turnOnCorners = (grid) => {
  grid[0][0] = true;
  grid[0][grid[0].length - 1] = true;
  grid[grid.length - 1][0] = true;
  grid[grid.length - 1][grid[0].length - 1] = true;
};

const runAnimation = (keepCornersOn = false) => {
  const grids = [makeGrid(), makeGrid()];
  let i;
  for (i = 0; i < 100; i++) {
    if (keepCornersOn) turnOnCorners(grids[i % 2]);
    makeNextGrid(grids[i % 2], grids[(i + 1) % 2]);
  }
  if (keepCornersOn) turnOnCorners(grids[i % 2]);
  return grids[i % 2].flat().filter(Boolean).length;
};

const part1 = () => runAnimation();

const part2 = () => runAnimation(true);

console.log('part1', part1());
console.log('part2', part2());
