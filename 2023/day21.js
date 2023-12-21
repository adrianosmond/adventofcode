import {
  getNeighbours,
  gridToCells,
  inputToCharGrid,
} from '../utils/functions.js';
import readInput from '../utils/readInput.js';

const input = readInput();
const grid = inputToCharGrid(input);
const start = gridToCells(grid)
  .filter(([cell]) => cell === 'S')
  .map(([, r, c]) => [r, c])
  .flat();

grid[start[0]][start[1]] = '.';

const getReachableSquares = (startRow, startCol, numSteps) => {
  const queue = [[startRow, startCol, numSteps]];
  const visited = {
    [`${startRow},${startCol}`]: true,
  };
  let reachableSquares = 0;
  while (queue.length > 0) {
    const [row, col, remainingSteps] = queue.shift();
    if (remainingSteps % 2 === 0) reachableSquares++;
    if (remainingSteps > 0) {
      getNeighbours(grid, row, col).forEach(([r, c, cell]) => {
        if (cell !== '#' && !visited[`${r},${c}`]) {
          queue.push([r, c, remainingSteps - 1]);
          visited[`${r},${c}`] = true;
        }
      });
    }
  }

  return reachableSquares;
};

export const part1 = (numSteps = 64) =>
  getReachableSquares(start[0], start[1], numSteps);

export const part2 = () => {
  // This was beyond me. Followed along with https://www.youtube.com/watch?v=9UOMZSL0JTg
  const gridSize = grid.length;
  const numSteps = 26501365;
  const fullGridsInOneDirection = Math.floor(numSteps / gridSize) - 1;
  const oddStepGrids = (Math.floor(fullGridsInOneDirection / 2) * 2 + 1) ** 2;
  const evenStepGrids =
    (Math.floor((fullGridsInOneDirection + 1) / 2) * 2) ** 2;

  const reachableOnOddGrids = getReachableSquares(
    start[0],
    start[1],
    gridSize * 2 + 1,
  );
  const reachableOnEvenGrids = getReachableSquares(
    start[0],
    start[1],
    gridSize * 2,
  );

  let ans = 0;
  ans += oddStepGrids * reachableOnOddGrids;
  ans += evenStepGrids * reachableOnEvenGrids;
  ans += getReachableSquares(gridSize - 1, start[1], gridSize - 1); // top point
  ans += getReachableSquares(start[0], 0, gridSize - 1); // left point
  ans += getReachableSquares(0, start[1], gridSize - 1); // bottom point
  ans += getReachableSquares(start[0], gridSize - 1, gridSize - 1); // left point

  // top right small segment
  ans +=
    (fullGridsInOneDirection + 1) *
    getReachableSquares(gridSize - 1, 0, Math.floor(gridSize / 2) - 1);

  // top left small segment
  ans +=
    (fullGridsInOneDirection + 1) *
    getReachableSquares(
      gridSize - 1,
      gridSize - 1,
      Math.floor(gridSize / 2) - 1,
    );

  // bottom left small segment
  ans +=
    (fullGridsInOneDirection + 1) *
    getReachableSquares(0, gridSize - 1, Math.floor(gridSize / 2) - 1);

  // bottom right small segment
  ans +=
    (fullGridsInOneDirection + 1) *
    getReachableSquares(0, 0, Math.floor(gridSize / 2) - 1);

  // top right large segment
  ans +=
    fullGridsInOneDirection *
    getReachableSquares(gridSize - 1, 0, Math.floor((3 * gridSize) / 2) - 1);

  // top left large segment
  ans +=
    fullGridsInOneDirection *
    getReachableSquares(
      gridSize - 1,
      gridSize - 1,
      Math.floor((3 * gridSize) / 2) - 1,
    );

  // bottom left large segment
  ans +=
    fullGridsInOneDirection *
    getReachableSquares(0, gridSize - 1, Math.floor((3 * gridSize) / 2) - 1);

  // bottom right large segment
  ans +=
    fullGridsInOneDirection *
    getReachableSquares(0, 0, Math.floor((3 * gridSize) / 2) - 1);

  return ans;
};

console.log('part1', part1());
console.log('part2', part2());
