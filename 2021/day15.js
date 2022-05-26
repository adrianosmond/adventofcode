import { readInput, getNeighbours } from '../utils/functions.js';

const input = readInput();

const getShortestDistance = (grid) => {
  const bestDistances = new Array(grid.length)
    .fill(0)
    .map(() => new Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER));
  bestDistances[0][0] = 0;

  const start = [0, 0];
  const queue = [start];
  while (queue.length > 0) {
    const [row, col] = queue.shift();
    const currentDistance = bestDistances[row][col];
    getNeighbours(grid, row, col).forEach(([r, c, risk]) => {
      if (currentDistance + risk < bestDistances[r][c]) {
        queue.push([r, c]);
        bestDistances[r][c] = currentDistance + risk;
      }
    });
  }
  return bestDistances[grid.length - 1][grid[0].length - 1];
};

const makeGrid = (numRepeats = 1) => {
  const risks = input
    .split('\n')
    .map((r) => r.split('').map((n) => parseInt(n, 10)));
  const rs = risks.length;
  const cs = risks[0].length;
  const grid = new Array(numRepeats * rs)
    .fill(0)
    .map(() => new Array(numRepeats * cs).fill(0));

  for (let i = 0; i < numRepeats; i++) {
    for (let j = 0; j < numRepeats; j++) {
      for (let r = 0; r < rs; r++) {
        for (let c = 0; c < cs; c++) {
          grid[i * rs + r][j * cs + c] = risks[r][c] + i + j;
          if (grid[i * rs + r][j * cs + c] > 9)
            grid[i * rs + r][j * cs + c] -= 9;
        }
      }
    }
  }

  return grid;
};

const part1 = () => getShortestDistance(makeGrid());

const part2 = () => getShortestDistance(makeGrid(5));

console.log('part1', part1());
console.log('part2', part2());
