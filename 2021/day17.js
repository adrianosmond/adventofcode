import { readInput } from '../utils/functions.js';

const input = readInput();

const [, xMin, xMax, yMin, yMax] = input
  .match(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/)
  .map((n) => parseInt(n, 10));

const simulate = (vx, vy) => {
  let maxY = 0;
  let x = 0;
  let y = 0;
  for (let i = 0; y > yMin; i++) {
    x += vx;
    y += vy;
    maxY = Math.max(maxY, y);
    if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      return [true, maxY];
    }
    if (vx > 0) vx--;
    if (vx < 0) vx++;
    vy--;
  }
  return [false, maxY];
};

const part1 = () => {
  let maxY = 0;
  for (let vx = xMax; vx > 0; vx--) {
    for (let vy = yMin; vy < 200; vy++) {
      const [success, max] = simulate(vx, vy);
      if (success) maxY = Math.max(maxY, max);
    }
  }
  return maxY;
};

const part2 = () => {
  let count = 0;
  for (let vx = xMax; vx > 0; vx--) {
    for (let vy = yMin; vy < 200; vy++) {
      const [success] = simulate(vx, vy);
      if (success) count++;
    }
  }
  return count;
};

console.log('part1', part1());
console.log('part2', part2());
