import readInput from '../utils/readInput.js';
import { getNeighbours, multilineStrToIntArrays } from '../utils/functions.js';

const input = readInput();
const coords = multilineStrToIntArrays(input, ',');
let grid;

const makeGrid = (gridSize, numBytes) => {
  grid = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill('.'));

  for (let i = 0; i < numBytes; i++) {
    const [x, y] = coords[i];
    grid[y][x] = '#';
  }
};

const findPath = (size) => {
  const queue = [[0, 0]];
  const visited = {
    '0,0': 0,
  };

  while (queue.length > 0) {
    const [y, x] = queue.shift();
    const distance = visited[`${y},${x}`];
    if (x === size - 1 && y === size - 1) {
      return distance;
    }
    const neighbours = getNeighbours(grid, y, x);

    neighbours.forEach(([row, col, cell]) => {
      if (cell === '#') return;
      const nextDistance = distance + 1;
      if (visited[`${row},${col}`] && visited[`${row},${col}`] <= nextDistance)
        return;

      visited[`${row},${col}`] = nextDistance;
      queue.push([row, col]);
    });
  }

  return -1;
};

export const part1 = (size = 71, bytes = 1024) => {
  makeGrid(size, bytes);
  return findPath(size);
};

export const part2 = (size = 71, bytes = 1024) => {
  for (let numBytes = bytes; numBytes < coords.length; numBytes++) {
    makeGrid(size, numBytes);
    if (findPath(size) === -1) {
      return coords[numBytes - 1].join(',');
    }
  }
};
