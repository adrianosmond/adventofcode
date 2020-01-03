const input = require('./input13');

const makeKey = ([x, y]) => `${x},${y}`;

const start = [1, 1];
const startKey = makeKey(start);
const target = [31, 39];
const targetKey = makeKey(target);
const grid = {
  [startKey]: '.',
};

const getContents = ([x, y]) => {
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

const getNeighbours = ([x, y]) => {
  const neighbours = [];
  if (x > 0) {
    const n = [x - 1, y];
    if (getContents(n) === '.') {
      neighbours.push(n);
    }
  }
  if (y > 0) {
    const n = [x, y - 1];
    if (getContents(n) === '.') {
      neighbours.push(n);
    }
  }

  let n = [x + 1, y];
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
  const distances = {
    '1,1': 0,
  };

  while (queue.length > 0) {
    const current = queue.shift();
    const key = makeKey(current);

    if (distances[key] === 100) continue;

    const neighbours = getNeighbours(current);
    neighbours.forEach(neighbour => {
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
console.log('part1:', distances[targetKey]);
console.log('part2:', Object.values(distances).filter(v => v <= 50).length);
