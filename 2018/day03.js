// multi line string
import { sum } from '../utils/reducers.js';

import input from './input03.js';

const claims = input.split('\n').map((claim) =>
  claim
    .replace(/[#@:]/g, '')
    .replace(/[\sx]/g, ',')
    .split(',')
    .filter(Boolean)
    .map((x) => parseInt(x, 10)),
);

const MAX_WIDTH = Math.max(...claims.map((c) => c[1] + c[3])) + 1;
const MAX_HEIGHT = Math.max(...claims.map((c) => c[2] + c[4])) + 1;

const grid = new Array(MAX_HEIGHT)
  .fill()
  .map(() => new Array(MAX_WIDTH).fill());

for (let y = 0; y < MAX_HEIGHT; y++) {
  for (let x = 0; x < MAX_WIDTH; x++) {
    grid[y][x] = {};
  }
}

const unique = claims.map(() => false);

claims.forEach(([elf, x, y, w, h]) => {
  const competition = new Set();
  for (let i = y; i < y + h; i++) {
    for (let j = x; j < x + w; j++) {
      const otherElves = Object.keys(grid[i][j]);
      otherElves.forEach((e) => competition.add(e));
      grid[i][j][elf] = true;
    }
  }
  if (
    competition.size === 0 ||
    (competition.size === 1 && competition.has(elf))
  ) {
    unique[elf - 1] = true;
  } else {
    competition.forEach((e) => {
      unique[e - 1] = false;
    });
  }
});

const contested = grid
  .map(
    (row) =>
      row.map((cell) => Object.keys(cell).length).filter((cell) => cell > 1)
        .length,
  )
  .reduce(sum);

const uniqueElf = unique.map((e, idx) => e && idx + 1).filter(Boolean);

console.log('part1:', contested);
console.log('part2:', uniqueElf[0]);
