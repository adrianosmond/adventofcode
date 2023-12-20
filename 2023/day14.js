import readInput from '../utils/readInput.js';
import { gridToCells, inputToCharGrid } from '../utils/functions.js';

const input = readInput();

const moveUp = (grid) => {
  let changed = true;

  while (changed) {
    changed = false;
    for (let row = 1; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col] === 'O' && grid[row - 1][col] === '.') {
          grid[row][col] = '.';
          grid[row - 1][col] = 'O';
          changed = true;
        }
      }
    }
  }
};

const moveDown = (grid) => {
  let changed = true;

  while (changed) {
    changed = false;
    for (let row = grid.length - 2; row >= 0; row--) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col] === 'O' && grid[row + 1][col] === '.') {
          grid[row][col] = '.';
          grid[row + 1][col] = 'O';
          changed = true;
        }
      }
    }
  }
};
const moveLeft = (grid) => {
  let changed = true;

  while (changed) {
    changed = false;
    for (let col = 1; col < grid[0].length; col++) {
      for (let row = 0; row < grid.length; row++) {
        if (grid[row][col] === 'O' && grid[row][col - 1] === '.') {
          grid[row][col] = '.';
          grid[row][col - 1] = 'O';
          changed = true;
        }
      }
    }
  }
};

const moveRight = (grid) => {
  let changed = true;

  while (changed) {
    changed = false;
    for (let col = grid[0].length - 2; col >= 0; col--) {
      for (let row = 0; row < grid.length; row++) {
        if (grid[row][col] === 'O' && grid[row][col + 1] === '.') {
          grid[row][col] = '.';
          grid[row][col + 1] = 'O';
          changed = true;
        }
      }
    }
  }
};

const getLoad = (grid) =>
  gridToCells(grid)
    .filter(([cell]) => cell === 'O')
    .reduce((load, [, row]) => load + grid.length - row, 0);

const doCycle = (grid) => {
  moveUp(grid);
  moveLeft(grid);
  moveDown(grid);
  moveRight(grid);
};

export const part1 = () => {
  const grid = inputToCharGrid(input);
  moveUp(grid);
  return getLoad(grid);
};

export const part2 = () => {
  const grid = inputToCharGrid(input);
  const loads = {};
  const target = 1000000000;
  let cycles = 0;
  let repeatCount = 0;
  let cycleLength = -1;

  while (cycles < target) {
    doCycle(grid);
    cycles++;
    const load = getLoad(grid);

    if (loads[load]) {
      repeatCount++;
      if (
        cycleLength < 0 &&
        repeatCount === cycles - loads[load] &&
        repeatCount > 2
      ) {
        cycleLength = cycles - loads[load];
        cycles += cycleLength * Math.floor((target - cycles) / cycleLength);
      }
    } else {
      repeatCount = 0;
    }
    loads[load] = cycles;
  }

  return getLoad(grid);
};
