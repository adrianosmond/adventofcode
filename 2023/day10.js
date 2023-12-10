import { getNeighbours, gridToCells, readInput } from '../utils/functions.js';

const input = readInput();

const grid = input.split('\n').map((r) => r.split(''));

grid.forEach((r) => {
  r.unshift('.');
  r.push('.');
});
grid.unshift(Array(grid[0].length).fill('.'));
grid.push(Array(grid[0].length).fill('.'));

const path = structuredClone(grid);

const start = gridToCells(grid)
  .filter(([cell]) => cell === 'S')
  .map(([, row, col]) => [row, col])[0];

const replaceStartCell = () => {
  const [below, above, right, left] = getNeighbours(grid, ...start).map(
    ([, , cell]) => cell,
  );
  const canGoUp = ['|', 'F', '7'].includes(above);
  const canGoDown = ['|', 'L', 'J'].includes(below);
  const canGoRight = ['-', '7', 'J'].includes(right);
  const canGoLeft = ['-', 'L', 'F'].includes(left);

  if (canGoUp && canGoDown) grid[start[0]][start[1]] = '|';
  if (canGoLeft && canGoRight) grid[start[0]][start[1]] = '-';
  if (canGoUp && canGoRight) grid[start[0]][start[1]] = 'L';
  if (canGoUp && canGoLeft) grid[start[0]][start[1]] = 'J';
  if (canGoDown && canGoLeft) grid[start[0]][start[1]] = '7';
  if (canGoDown && canGoRight) grid[start[0]][start[1]] = 'F';
};

const part1 = () => {
  replaceStartCell();
  let [r, c] = start;
  let prevDir = '';
  let count = 0;

  do {
    const cell = grid[r][c];
    const canGoUp = ['|', 'L', 'J'].includes(cell);
    const canGoDown = ['|', 'F', '7'].includes(cell);
    const canGoRight = ['-', 'L', 'F'].includes(cell);
    const canGoLeft = ['-', '7', 'J'].includes(cell);
    path[r][c] = '#';
    if (canGoRight && prevDir !== 'R') {
      c++;
      prevDir = 'L';
    } else if (canGoLeft && prevDir !== 'L') {
      c--;
      prevDir = 'R';
    } else if (canGoUp && prevDir !== 'U') {
      r--;
      prevDir = 'D';
    } else if (canGoDown && prevDir !== 'D') {
      r++;
      prevDir = 'U';
    }
    count++;
  } while (r !== start[0] || c !== start[1]);
  return count / 2;
};

const part2 = () => {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    let isInsideLoop = false;
    let isTravellingAlongPath = false;
    let pathEntry = '';
    for (let c = 0; c < grid[r].length; c++) {
      const isPathCell = path[r][c] === '#';
      const cell = grid[r][c];
      if (isPathCell) {
        // Encountering a | means we're crossing into or out of the loop
        if (cell === '|') {
          isInsideLoop = !isInsideLoop;

          // Otherwise we've found a corner and need to decide what to do with it
          // when we reach the next corner
        } else if (!isTravellingAlongPath) {
          isTravellingAlongPath = true;
          pathEntry = cell;

          // If the path returns in the vertical direction it came from
          // ie. L-J or F-7, we never entered the loop. Just note that
          // we aren't travelling along the path any more
        } else if (
          (pathEntry === 'L' && cell === 'J') ||
          (pathEntry === 'F' && cell === '7')
        ) {
          isTravellingAlongPath = false;

          // If the path returns in the vertical direction it came from
          // ie. L-J or F-7, we never entered the loop. Just note that
          // we aren't travelling along the path any more
        } else if (
          (pathEntry === 'L' && cell === '7') ||
          (pathEntry === 'F' && cell === 'J')

          // If the path changes vertical direction ie. L-7 or F-J,
          // we're crossing into or out of the loop
        ) {
          isInsideLoop = !isInsideLoop;
          isTravellingAlongPath = false;
        }

        // If we're inside the loop and we aren't on a piece of the loop, we found an inner cell
      } else if (isInsideLoop) {
        count++;
      }
    }
  }

  return count;
};

console.log('part1', part1());
console.log('part2', part2());
