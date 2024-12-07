import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

type Cell = '#' | '.';

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

const checkReflection = (grid: string[], resultToIgnore = -1) => {
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

const opposite: Record<Cell, Cell> = {
  '#': '.',
  '.': '#',
};

const findReflections = (gridIdx: number) =>
  100 * checkReflection(grids[gridIdx]) || checkReflection(rotated[gridIdx]);

const smudgeCell = (row: string, col: number) => {
  const smudged = row.split('') as Cell[];
  smudged[col] = opposite[smudged[col]];
  return smudged.join('');
};

const findSmudges = (gridIdx: number) => {
  for (const [grid, multiplier] of [
    [rotated[gridIdx], 1] as const,
    [grids[gridIdx], 100] as const,
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
  throw new Error('Something went wrong');
};

export const part1 = () =>
  [...Array(grids.length).keys()].map(findReflections).reduce(sum);

export const part2 = () =>
  [...Array(grids.length).keys()].map(findSmudges).reduce(sum);
