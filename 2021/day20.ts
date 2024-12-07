import readInput from '../utils/readInput.ts';

const input = readInput();
type Pixel = '.' | '#';
type Grid = {
  min: number;
  max: number;
  infinity: Pixel;
  light: Record<string, boolean>;
};
const [algorithm, img] = input.split('\n\n');
let grids: Grid[];

const setup = () => {
  grids = new Array(2).fill(0).map(() => ({
    min: 0,
    max: img.split('\n').length - 1,
    infinity: '.',
    light: {},
  }));

  img.split('\n').forEach((r, y) => {
    r.split('').forEach((c, x) => {
      if (c === '#') grids[0].light[`${x},${y}`] = true;
    });
  });
};

const getPixel = (x: number, y: number, grid: Grid) => {
  const { min, max } = grid;
  let binary = 0;
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      binary <<= 1;
      if (
        ((i < min || j < min || i > max || j > max) && grid.infinity === '#') ||
        grid.light[`${j},${i}`]
      ) {
        binary++;
      }
    }
  }
  return algorithm[binary];
};

const emptyGrid = (curr: number, prev: number) => {
  const grid = grids[curr];
  grid.min = grids[prev].min - 1;
  grid.max = grids[prev].max + 1;
  grid.infinity =
    grids[prev].infinity === '.'
      ? (algorithm[0] as Pixel)
      : (algorithm[511] as Pixel);
  grid.light = {};
};

const performEnhancements = (numEnhancements: number) => {
  setup();
  let grid: Grid;
  for (let round = 1; round <= numEnhancements; round++) {
    const prev = (round + 1) % 2;
    const curr = round % 2;
    emptyGrid(curr, prev);
    grid = grids[curr];
    for (let y = grid.min; y <= grid.max; y++) {
      for (let x = grid.min; x <= grid.max; x++) {
        if (getPixel(x, y, grids[prev]) === '#') grid.light[`${x},${y}`] = true;
      }
    }
  }
  return Object.keys(grid!.light).length;
};

export const part1 = () => performEnhancements(2);

export const part2 = () => performEnhancements(50);
