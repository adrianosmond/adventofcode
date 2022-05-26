import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input22.txt'), 'utf8');

const cuboids = input.split('\n').map((r) => {
  const parsed = r.match(
    /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/,
  );
  const [, onOff, xMin, xMax, yMin, yMax, zMin, zMax] = parsed;
  return [
    onOff,
    [
      [parseInt(xMin, 10), parseInt(xMax, 10)],
      [parseInt(yMin, 10), parseInt(yMax, 10)],
      [parseInt(zMin, 10), parseInt(zMax, 10)],
    ],
  ];
});

const getVolume = ([[xMin, xMax], [yMin, yMax], [zMin, zMax]]) =>
  Math.abs(xMax - xMin + 1) *
  Math.abs(yMax - yMin + 1) *
  Math.abs(zMax - zMin + 1);

const get1DOverlap = (min, max, min2, max2) => {
  let oMin;
  let oMax;
  if (min <= min2 && max >= min2 && max <= max2) {
    oMin = min2;
    oMax = max;
  } else if (min >= min2 && max <= max2) {
    oMin = min;
    oMax = max;
  } else if (min >= min2 && min <= max2 && max >= max2) {
    oMin = min;
    oMax = max2;
  } else if (min2 >= min && max2 <= max) {
    oMin = min2;
    oMax = max2;
  } else {
    return false;
  }
  return [oMin, oMax];
};

const get3DOverlap = (
  [[xMin, xMax], [yMin, yMax], [zMin, zMax]],
  [[xMin2, xMax2], [yMin2, yMax2], [zMin2, zMax2]],
) => {
  const xOverlapBounds = get1DOverlap(xMin, xMax, xMin2, xMax2);
  const yOverlapBounds = get1DOverlap(yMin, yMax, yMin2, yMax2);
  const zOverlapBounds = get1DOverlap(zMin, zMax, zMin2, zMax2);

  if (!xOverlapBounds || !yOverlapBounds || !zOverlapBounds) return 0;

  return [xOverlapBounds, yOverlapBounds, zOverlapBounds];
};

const getTotalNegatedByFutureCuboids = (cuboid, futureCuboids) => {
  if (futureCuboids.length === 0) return 0;

  let totalOverlap = 0;
  for (let i = 0; i < futureCuboids.length; i++) {
    const current = futureCuboids[i];
    const overlap = get3DOverlap(cuboid, current);
    if (overlap)
      totalOverlap +=
        getVolume(overlap) -
        getTotalNegatedByFutureCuboids(overlap, futureCuboids.slice(i + 1));
  }
  return totalOverlap;
};

const followSteps = (limitRange = false) => {
  let numOn = 0;
  const futureCuboids = [];

  // NB: Going in reverse
  for (let i = cuboids.length - 1; i >= 0; i--) {
    const [onOff, cuboid] = cuboids[i];
    if (limitRange) {
      const [[xMin, xMax], [yMin, yMax], [zMin, zMax]] = cuboid;
      if (Math.min(xMin, yMin, zMin) < -50 || Math.max(xMax, yMax, zMax) > 50) {
        continue;
      }
    }

    if (onOff === 'on') {
      numOn +=
        getVolume(cuboid) -
        getTotalNegatedByFutureCuboids(cuboid, futureCuboids);
    }

    futureCuboids.push(cuboid);
  }
  return numOn;
};

const part1 = () => followSteps(true);

const part2 = () => followSteps();

console.log('part1', part1());
console.log('part2', part2());
