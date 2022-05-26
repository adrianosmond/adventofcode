import { readInput, permutator, getNeighbours } from '../utils/functions.js';

const input = readInput();

const grid = input.split('\n').map((r) => r.split(''));

const getDistance = (from, to) => {
  const queue = [from];
  const dist = new Array(grid.length)
    .fill(0)
    .map(() => new Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER));
  dist[from[1]][from[0]] = 0;

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    if (x === to[0] && y === to[1]) {
      return dist[to[1]][to[0]];
    }
    const neighbours = getNeighbours(grid, y, x);

    neighbours.forEach(([nY, nX, val]) => {
      if (val === '.' && dist[y][x] + 1 < dist[nY][nX]) {
        queue.push([nX, nY]);
        dist[nY][nX] = dist[y][x] + 1;
      }
    });
  }
};

const positions = [];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === '#' || grid[y][x] === '.') continue;
    positions[parseInt(grid[y][x], 10)] = [x, y];
    grid[y][x] = '.';
  }
}
const distances = new Array(positions.length)
  .fill(0)
  .map(() => new Array(positions.length).fill(0));

for (let i = 0; i < positions.length; i++) {
  for (let j = i + 1; j < positions.length; j++) {
    const distance = getDistance(positions[i], positions[j]);
    distances[i][j] = distance;
    distances[j][i] = distance;
  }
}
const toVisit = new Array(positions.length - 1).fill(0).map((_, i) => i + 1);

const getBestDistanceForRoute = (routes) => {
  let bestDistance = Number.MAX_SAFE_INTEGER;

  routes.forEach((route) => {
    let prev = 0;
    let distance = 0;
    route.forEach((stop) => {
      distance += distances[prev][stop];
      prev = stop;
    });
    bestDistance = Math.min(distance, bestDistance);
  });

  return bestDistance;
};

const part1 = () => getBestDistanceForRoute(permutator(toVisit));

const part2 = () =>
  getBestDistanceForRoute(permutator(toVisit).map((r) => [...r, 0]));

console.log('part1', part1());
console.log('part2', part2());
