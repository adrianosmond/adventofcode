import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

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

const grid: Array<Array<Record<number, boolean>>> = new Array(MAX_HEIGHT)
  .fill(null)
  .map(() => new Array(MAX_WIDTH).fill(null).map(() => ({})));

const unique = claims.map(() => false);

claims.forEach(([elf, x, y, w, h]) => {
  const competition = new Set<number>();
  for (let i = y; i < y + h; i++) {
    for (let j = x; j < x + w; j++) {
      const otherElves = Object.keys(grid[i][j]);
      otherElves.forEach((e) => competition.add(parseInt(e, 10)));
      grid[i][j][elf] = true;
    }
  }
  if (
    competition.size === 0 ||
    (competition.size === 1 && competition.has(elf))
  ) {
    unique[elf - 1] = true;
  } else {
    competition.forEach((e: number) => {
      unique[e - 1] = false;
    });
  }
});

export const part1 = () =>
  grid
    .map(
      (row) =>
        row.map((cell) => Object.keys(cell).length).filter((cell) => cell > 1)
          .length,
    )
    .reduce(sum);

export const part2 = () =>
  unique.map((e, idx) => e && idx + 1).filter(Boolean)[0];
