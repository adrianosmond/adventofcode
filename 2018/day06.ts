import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput()
  .split('\n')
  .map((line) => strToIntArray(line, ', '));

const getInputLimits = (): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} =>
  input.reduce(
    (currentBest, newValues) => ({
      minX: Math.min(currentBest.minX, newValues[0]),
      maxX: Math.max(currentBest.maxX, newValues[0]),
      minY: Math.min(currentBest.minY, newValues[1]),
      maxY: Math.max(currentBest.maxY, newValues[1]),
    }),
    {
      minX: Number.MAX_VALUE,
      maxX: Number.MIN_VALUE,
      minY: Number.MAX_VALUE,
      maxY: Number.MIN_VALUE,
    },
  );

const createMap = (limits: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}): string[][] => {
  const map = [];
  for (let y = 0; y <= limits.maxY; y++) {
    map[y] = new Array(limits.maxX).fill('#');
  }
  return map;
};

const distance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const findClosestPoint = (x: number, y: number): number | undefined => {
  const distances = input.map((i) => distance(x, y, i[0], i[1]));
  const best = Math.min(...distances);
  const candidates = distances.filter((d) => d === best);
  if (candidates.length === 1) {
    return distances.indexOf(best);
  }
  return undefined;
};

function addIfValid(x: string, infinite: string[]) {
  if (x !== '#' && infinite.indexOf(x) === -1) {
    infinite.push(x);
  }
}

function getInfiniteAreas(map: string[][]): string[] {
  const infinite: string[] = [];
  for (let i = 0; i < map.length; i++) {
    addIfValid(map[i][0], infinite);
    addIfValid(map[i][map[i].length - 1], infinite);
  }
  for (let i = 0; i < map[0].length; i++) {
    addIfValid(map[0][i], infinite);
    addIfValid(map[map.length - 1][i], infinite);
  }
  return infinite;
}

const isWithinThreshold = (x: number, y: number, threshold: number): string =>
  input.reduce((acc, c) => acc + distance(x, y, c[0], c[1]), 0) < threshold
    ? '#'
    : '.';

export const part1 = () => {
  const limits = getInputLimits();
  const map = createMap(limits);
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const best = findClosestPoint(x, y);
      if (best !== undefined) {
        map[y][x] = best.toString();
      }
    }
  }
  const infinite = getInfiniteAreas(map);
  const nonInf = map.flat().filter((x) => x !== '#' && !infinite.includes(x));

  const areas: Record<string, number> = nonInf.reduce<Record<string, number>>(
    (acc, curr) => ({
      ...acc,
      [curr]: acc[curr] ? acc[curr] + 1 : 1,
    }),
    {},
  );
  return Math.max(...Object.values(areas));
};

export const part2 = () => {
  const limits = getInputLimits();
  const map = createMap(limits);
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      map[y][x] = isWithinThreshold(x, y, 10000);
    }
  }
  return map.flat().filter((x) => x === '#').length;
};
