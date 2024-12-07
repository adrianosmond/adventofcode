import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = parseInt(readInput(), 10);

const getCoordinates = (number: number): [number, number] => {
  let sideLength = 3;
  let score = 9;
  let numSides = 0;
  let found = false;
  while (true) {
    for (numSides = 0; numSides < 4; numSides++) {
      score += 1 + sideLength;
      if (score >= number) {
        found = true;
        break;
      }
    }
    if (!found) {
      sideLength += 2;
    } else {
      break;
    }
  }
  if (numSides === 0) {
    return [(sideLength + 1) / 2, (sideLength + 1) / 2 - (score - number)];
  }
  if (numSides === 1) {
    return [-((sideLength + 1) / 2) + (score - number), (sideLength + 1) / 2];
  }
  if (numSides === 2) {
    return [
      -((sideLength + 1) / 2),
      -((sideLength + 1) / 2) + (score - number),
    ];
  }
  if (numSides === 3) {
    return [(sideLength + 1) / 2 - (score - number), -((sideLength + 1) / 2)];
  }
  throw new Error('Coordinate not found');
};

export const part1 = () => {
  const coords = getCoordinates(input);
  return coords.map(Math.abs).reduce(sum);
};

const getNextDirection = (dir: [number, number]): [number, number] => {
  if (dir[0] === 1 && dir[1] === 0) {
    return [0, -1];
  }
  if (dir[0] === 0 && dir[1] === 1) {
    return [1, 0];
  }
  if (dir[0] === -1 && dir[1] === 0) {
    return [0, 1];
  }
  if (dir[0] === 0 && dir[1] === -1) {
    return [-1, 0];
  }
  throw new Error('Next direction not found');
};

function getSurroundings(grid: number[][], y: number, x: number): number {
  return (
    grid[y - 1][x - 1] +
    grid[y - 1][x] +
    grid[y - 1][x + 1] +
    grid[y][x - 1] +
    grid[y][x + 1] +
    grid[y + 1][x - 1] +
    grid[y + 1][x] +
    grid[y + 1][x + 1]
  );
}

export const part2 = () => {
  const size = 15;
  const grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = Array(size).fill(0);
  }
  const center = (size - 1) / 2;
  grid[center][center] = 1;
  let direction: [number, number] = [0, 1];
  let nextDirection = getNextDirection(direction);
  const current: [number, number] = [center, center];
  while (true) {
    current[0] += direction[0];
    current[1] += direction[1];
    grid[current[0]][current[1]] = getSurroundings(
      grid,
      current[0],
      current[1],
    );
    if (grid[current[0]][current[1]] > input) {
      break;
    }
    if (
      grid[current[0] + nextDirection[0]][current[1] + nextDirection[1]] === 0
    ) {
      direction = nextDirection;
      nextDirection = getNextDirection(direction);
    }
  }

  return grid[current[0]][current[1]];
};
