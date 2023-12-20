import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const grids = input.split('\n\n').map((g) => g.split('\n'));
const rotated = grids.map((g) => {
  const res = [];
  for (let i = 0; i < g[0].length; i++) {
    let row = '';
    for (let j = 0; j < g.length; j++) {
      row += g[j][i];
    }
    res.push(row);
  }
  return res;
});

const checkReflection = (grid, resultToIgnore = -1) => {
  for (let row = 0; row < grid.length - 1; row++) {
    if (row + 1 === resultToIgnore) continue;
    if (grid[row] === grid[row + 1]) {
      let i = 1;
      let found = true;
      while (found && row - i >= 0 && row + i + 1 < grid.length) {
        if (grid[row - i] !== grid[row + i + 1]) {
          found = false;
        }
        i++;
      }
      if (found) return row + 1;
    }
  }
  return 0;
};

const opposite = {
  '#': '.',
  '.': '#',
};

const findReflections = (gridIdx) =>
  100 * checkReflection(grids[gridIdx]) || checkReflection(rotated[gridIdx]);

const smudgeCell = (row, col) => {
  const smudged = row.split('');
  smudged[col] = opposite[smudged[col]];
  return smudged.join('');
};

const findSmudges = (gridIdx) => {
  for (const [grid, multiplier] of [
    [rotated[gridIdx], 1],
    [grids[gridIdx], 100],
  ]) {
    const originalResult = checkReflection(grid);
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const original = grid[row];
        grid[row] = smudgeCell(original, col);
        const result = checkReflection(grid, originalResult);
        if (result !== 0 && result !== originalResult) {
          return result * multiplier;
        }
        grid[row] = original;
      }
    }
  }
};

export const part1 = () =>
  [...Array(grids.length).keys()].map(findReflections).reduce(sum);

export const part2 = () =>
  [...Array(grids.length).keys()].map(findSmudges).reduce(sum);
