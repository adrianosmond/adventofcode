import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines, strToIntArray } from '../utils/functions.ts';

const input = readInput();
const rockPaths = splitAndMapInputLines(input, ' -> ', (coords) =>
  strToIntArray(coords, ','),
);

const xCoords = rockPaths.flat(2).filter((_, i) => i % 2 === 0);
const yCoords = rockPaths.flat(2).filter((_, i) => i % 2 === 1);

const maxY = Math.max(...yCoords) + 3;
const minX = Math.min(...xCoords) - maxY;
const maxX = Math.max(...xCoords) + maxY;

const cave = new Array(maxY)
  .fill(null)
  .map(() => new Array(maxX - minX).fill(' '));

rockPaths.forEach((path) => {
  path.forEach((coords) => {
    coords[0] -= minX - 1;
  });
});

rockPaths.forEach((path) => {
  for (let i = 1; i < path.length; i++) {
    const [prevX, prevY] = path[i - 1];
    const [currentX, currentY] = path[i];
    if (prevX === currentX) {
      for (
        let y = Math.min(currentY, prevY);
        y <= Math.max(currentY, prevY);
        y++
      ) {
        cave[y][currentX] = '#';
      }
    } else {
      for (
        let x = Math.min(currentX, prevX);
        x <= Math.max(currentX, prevX);
        x++
      ) {
        cave[currentY][x] = '#';
      }
    }
  }
});

let count = 0;

const dropSand = () => {
  const startX = 500 - (minX - 1);
  while (true) {
    let stopped = false;
    let y = 0;
    let x = startX;
    while (!stopped) {
      if (y >= maxY - 1) {
        return count;
      }
      if (cave[y + 1][x] === ' ') {
        y++;
      } else if (cave[y + 1][x - 1] === ' ') {
        y++;
        x--;
      } else if (cave[y + 1][x + 1] === ' ') {
        y++;
        x++;
      } else {
        cave[y][x] = 'o';
        stopped = true;
        if (y === 0) {
          return count + 1;
        }
      }
    }
    count++;
  }
};

export const part1 = () => dropSand();

export const part2 = () => {
  for (let x = 0; x < cave[0].length; x++) {
    cave[maxY - 1][x] = '#';
  }
  return dropSand();
};
