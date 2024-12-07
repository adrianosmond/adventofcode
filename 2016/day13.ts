import readInput from '../utils/readInput.ts';

type Coords = [number, number];
const input = parseInt(readInput(), 10);

const makeKey = ([x, y]: Coords) => `${x},${y}`;

const start: Coords = [1, 1];
const startKey = makeKey(start);
const target: Coords = [31, 39];
const targetKey = makeKey(target);
const grid = {
  [startKey]: '.',
};

const getContents = ([x, y]: Coords) => {
  const key = makeKey([x, y]);
  if (grid[key]) {
    return grid[key];
  }
  let val = x * x + 3 * x + 2 * x * y + y + y * y + input;
  let bits = 0;
  while (val > 0) {
    if (val % 2 === 1) {
      bits++;
    }
    val >>= 1;
  }
  if (bits % 2 === 1) {
    grid[key] = '#';
  } else {
    grid[key] = '.';
  }
  return grid[key];
};

const getNeighbours = ([x, y]: Coords) => {
  const neighbours: Coords[] = [];
  if (x > 0) {
    const n: Coords = [x - 1, y];
    if (getContents(n) === '.') {
      neighbours.push(n);
    }
  }
  if (y > 0) {
    const n: Coords = [x, y - 1];
    if (getContents(n) === '.') {
      neighbours.push(n);
    }
  }

  let n: Coords = [x + 1, y];
  if (getContents(n) === '.') {
    neighbours.push(n);
  }
  n = [x, y + 1];
  if (getContents(n) === '.') {
    neighbours.push(n);
  }
  return neighbours;
};

const makeDistanceMap = () => {
  const queue = [start];
  const distances: Record<string, number> = {
    '1,1': 0,
  };

  while (queue.length > 0) {
    const current: Coords = queue.shift()!;
    const key = makeKey(current);

    if (distances[key] === 100) continue;

    const neighbours: Coords[] = getNeighbours(current);
    neighbours.forEach((neighbour) => {
      const neighbourKey = makeKey(neighbour);
      if (!distances[neighbourKey]) {
        queue.push(neighbour);
        distances[neighbourKey] = distances[key] + 1;
      }
    });
  }

  return distances;
};

const distances = makeDistanceMap();

export const part1 = () => distances[targetKey];

export const part2 = () =>
  Object.values(distances).filter((v) => v <= 50).length;
