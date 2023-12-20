import readInput from '../utils/readInput.js';
import { multilineStrToIntArrays } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const UNCHECKED = 0;
const LAVA = 1;
const AIR = 2;

const cubes = multilineStrToIntArrays(input, ',');
const maxX = Math.max(...cubes.map(([x]) => x));
const maxY = Math.max(...cubes.map(([, y]) => y));
const maxZ = Math.max(...cubes.map(([, , z]) => z));

const isInBounds = ([x, y, z]) =>
  x >= 0 && y >= 0 && z >= 0 && x <= maxX && y <= maxY && z <= maxZ;

const getNeighbours = ([x, y, z]) => [
  [x - 1, y, z],
  [x + 1, y, z],
  [x, y - 1, z],
  [x, y + 1, z],
  [x, y, z - 1],
  [x, y, z + 1],
];

const makeCube = () => {
  const c = new Array(maxX + 1)
    .fill(0)
    .map(() =>
      new Array(maxY + 1)
        .fill(0)
        .map(() => new Array(maxZ + 1).fill(UNCHECKED)),
    );

  const isUnchecked = ([x, y, z]) => c[x][y][z] === UNCHECKED;

  cubes.forEach(([x, y, z]) => {
    c[x][y][z] = LAVA;
  });

  const queue = [[0, 0, 0]];
  while (queue.length > 0) {
    const [x, y, z] = queue.shift();
    c[x][y][z] = AIR;
    getNeighbours([x, y, z])
      .filter(isInBounds)
      .filter(isUnchecked)
      .forEach((pos) => {
        c[pos[0]][pos[1]][pos[2]] = AIR;
        queue.push(pos);
      });
  }

  return c;
};

const cube = makeCube();

const isNotLava = (p) => !isInBounds(p) || cube[p[0]][p[1]][p[2]] !== LAVA;

const isAir = (c) => !isInBounds(c) || cube[c[0]][c[1]][c[2]] === AIR;

const getSurfaceArea = (test) =>
  cubes.map((pos) => getNeighbours(pos).filter(test).length).reduce(sum);

export const part1 = () => getSurfaceArea(isNotLava);

export const part2 = () => getSurfaceArea(isAir);
