import readInput from '../utils/readInput.ts';
import { getNeighboursWithDiagonals } from '../utils/functions.ts';
import { product } from '../utils/reducers.ts';

const input = readInput();

let gridWidth = 101;
let gridHeight = 103;
type Coords = [number, number];
type Robot = {
  pos: Coords;
  vel: Coords;
};

const makeRobots = (): Robot[] =>
  input.split('\n').map((r) => {
    const [, px, py, vx, vy] = r
      .match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!
      .map((n) => parseInt(n, 10));

    return {
      pos: [px, py],
      vel: [vx, vy],
    };
  });

const moveRobots = (robots: Robot[]) => {
  robots.forEach((r) => {
    r.pos[0] += r.vel[0];
    r.pos[1] += r.vel[1];

    if (r.pos[0] < 0) r.pos[0] += gridWidth;
    if (r.pos[1] < 0) r.pos[1] += gridHeight;
    if (r.pos[0] > gridWidth - 1) r.pos[0] -= gridWidth;
    if (r.pos[1] > gridHeight - 1) r.pos[1] -= gridHeight;
  });
};

const mapRobotsToQuadrants = (robots: Robot[]) => {
  const quadrants = [0, 0, 0, 0];
  const midWidth = Math.floor(gridWidth / 2);
  const midHeight = Math.floor(gridHeight / 2);
  robots.forEach((r) => {
    if (r.pos[0] < midWidth && r.pos[1] < midHeight) quadrants[0]++;
    if (r.pos[0] > midWidth && r.pos[1] < midHeight) quadrants[1]++;
    if (r.pos[0] < midWidth && r.pos[1] > midHeight) quadrants[2]++;
    if (r.pos[0] > midWidth && r.pos[1] > midHeight) quadrants[3]++;
  });
  return quadrants;
};

const grid = new Array(gridHeight)
  .fill(0)
  .map(() => new Array(gridWidth).fill('.'));

const clearGrid = (robots: Robot[]) => {
  robots.forEach((r) => {
    grid[r.pos[1]][r.pos[0]] = '.';
  });
};

const plotRobotsToGrid = (robots: Robot[]) => {
  robots.forEach((r) => {
    grid[r.pos[1]][r.pos[0]] = '#';
  });
};

const printGrid = () => {
  console.log(grid.map((r) => r.join('')).join('\n'));
};

const mightBeTree = () => {
  let numSurrounded = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '#') {
        if (
          getNeighboursWithDiagonals(grid, r, c).every(([, , v]) => v === '#')
        ) {
          numSurrounded++;
        }
        if (numSurrounded === 25) return true;
      }
    }
  }
  return false;
};

const findChristmasTree = (robots: Robot[]) => {
  let time = 0;
  while (true) {
    time++;
    clearGrid(robots);
    moveRobots(robots);
    plotRobotsToGrid(robots);
    if (mightBeTree()) {
      printGrid();
      return time;
    }
  }
};

export const part1 = (w = 101, h = 103) => {
  gridWidth = w;
  gridHeight = h;
  const robots = makeRobots();
  for (let i = 0; i < 100; i++) {
    moveRobots(robots);
  }
  return mapRobotsToQuadrants(robots).reduce(product);
};

export const part2 = () => findChristmasTree(makeRobots());
