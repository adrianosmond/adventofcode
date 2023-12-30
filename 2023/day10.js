import readInput from '../utils/readInput.js';
import {
  getNeighbours,
  gridToCells,
  inputToCharGrid,
} from '../utils/functions.js';

const input = readInput();

const grid = inputToCharGrid(input);

grid.forEach((r) => {
  r.unshift('.');
  r.push('.');
});
grid.unshift(Array(grid[0].length).fill('.'));
grid.push(Array(grid[0].length).fill('.'));

const start = gridToCells(grid)
  .filter(([cell]) => cell === 'S')
  .map(([, row, col]) => [row, col])[0];

const [below, above, right, left] = getNeighbours(grid, ...start).map(
  ([, , cell]) => cell,
);

const connectsAbove = ['|', 'F', '7'].includes(above);
const connectsBelow = ['|', 'L', 'J'].includes(below);
const connectsRight = ['-', '7', 'J'].includes(right);
const connectsLeft = ['-', 'L', 'F'].includes(left);

if (connectsAbove && connectsBelow) grid[start[0]][start[1]] = '|';
if (connectsLeft && connectsRight) grid[start[0]][start[1]] = '-';
if (connectsAbove && connectsRight) grid[start[0]][start[1]] = 'L';
if (connectsAbove && connectsLeft) grid[start[0]][start[1]] = 'J';
if (connectsBelow && connectsLeft) grid[start[0]][start[1]] = '7';
if (connectsBelow && connectsRight) grid[start[0]][start[1]] = 'F';

const followPipe = (cb) => {
  let [r, c] = start;
  let cameFrom = '';

  do {
    const cell = grid[r][c];
    if (['-', 'L', 'F'].includes(cell) && cameFrom !== 'R') {
      c++; // move right
      cameFrom = 'L';
    } else if (['-', '7', 'J'].includes(cell) && cameFrom !== 'L') {
      c--; // move left
      cameFrom = 'R';
    } else if (['|', 'L', 'J'].includes(cell) && cameFrom !== 'U') {
      r--; // move up
      cameFrom = 'D';
    } else if (['|', 'F', '7'].includes(cell) && cameFrom !== 'D') {
      r++; // move down
      cameFrom = 'U';
    }
    cb(r, c);
  } while (r !== start[0] || c !== start[1]);
};

export const part1 = () => {
  let count = 0;
  followPipe(() => count++);
  return count / 2;
};

export const part2 = () => {
  const loop = grid.map((r) => r.map(() => '.'));
  followPipe((r, c) => {
    loop[r][c] = '#';
  });
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    let crossings = 0;
    for (let c = 0; c < grid[r].length; c++) {
      const isCellOnLoop = loop[r][c] === '#';
      const cell = grid[r][c];
      // Here it doesn't matter if we check for F and 7 or L and J
      // as long as we pick a pair with the same vertical direction
      // because seeing both the ups or downs means we've closed off
      // a segment, whereas seeing only one of them (ie L-7) means
      // we're inside the loop.
      if (isCellOnLoop && ['|', 'F', '7'].includes(cell)) {
        crossings++;
      } else if (!isCellOnLoop && crossings % 2 === 1) {
        count++;
      }
    }
  }

  return count;
};
