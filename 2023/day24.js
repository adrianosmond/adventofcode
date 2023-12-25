import { splitAndMapInputLines, strToIntArray } from '../utils/functions.js';
import readInput from '../utils/readInput.js';

const input = readInput();

const hailstones = splitAndMapInputLines(input, ' @ ').map((b) =>
  b.map((x) => strToIntArray(x, ', ')),
);
const X = 0;
const Y = 1;
const Z = 2;
const POS = 0;
const VEL = 1;

// The advantage of being at home on Christmas Eve is that I can get
// my dad to help me solve equations. My maths is terrible
const checkIntersection = (h1, h2, min, max) => {
  // parallel lines will never intersect
  if (h1[VEL][X] - h2[VEL][X] === 0 && h1[VEL][Y] - h2[VEL][Y] === 0)
    return false;

  const a = h1[POS][X];
  const b = h1[POS][Y];
  const c = h1[VEL][X];
  const d = h1[VEL][Y];

  const e = h2[POS][X];
  const f = h2[POS][Y];
  const g = h2[VEL][X];
  const h = h2[VEL][Y];

  const t = (-1 * h * (e - a) + g * (f - b)) / (g * d - c * h);
  const u = (-1 * d * (e - a) + c * (f - b)) / (g * d - c * h);

  // occurred in the past
  if (t < 0 || u < 0) return false;

  return [
    h1[POS][X] + h1[VEL][X] * t,
    h1[POS][Y] + h1[VEL][Y] * t,
    h2[POS][X] + h2[VEL][X] * u,
    h2[POS][Y] + h2[VEL][Y] * u,
  ].every((x) => x >= min && x <= max);
};

const testForIntersections = (min, max) => {
  let intersections = 0;
  for (let i = 0; i < hailstones.length; i++) {
    const h1 = hailstones[i];
    for (let j = i + 1; j < hailstones.length; j++) {
      const h2 = hailstones[j];
      if (checkIntersection(h1, h2, min, max)) {
        intersections++;
      }
    }
  }
  return intersections;
};

export const part1 = (min = 200000000000000, max = 400000000000000) =>
  testForIntersections(min, max);

const getRockVelocities = (axis) => {
  let opts = [];
  let optsInitialised = false;
  for (let i = 0; i < hailstones.length; i++) {
    const h1 = hailstones[i];
    for (let j = i + 1; j < hailstones.length; j++) {
      const h2 = hailstones[j];
      if (
        h1[VEL][axis] === h2[VEL][axis] &&
        (!optsInitialised || opts.length > 1)
      ) {
        const newOpts = [];
        const diff = h1[POS][axis] - h2[POS][axis];
        for (let k = -1000; k <= 1000; k++) {
          if (k === h1[VEL][axis]) continue;
          if (diff % (k - h1[VEL][axis]) === 0) newOpts.push(k);
        }
        if (!optsInitialised) {
          optsInitialised = true;
          opts = newOpts;
        } else {
          opts = opts.filter((o) => newOpts.includes(o));
        }
      }
      if (opts.length === 1) {
        return [opts[0]];
      }
    }
  }
};

// Too much maths for me. The only way I really understood it was
// the one described in this solution megathread
// https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/keqf8uq/
export const part2 = () => {
  const rvx = getRockVelocities(X);
  const rvy = getRockVelocities(Y);
  const rvz = getRockVelocities(Z);
  const [[h1x, h1y, h1z], [h1vx, h1vy, h1vz]] = hailstones[0];
  const [[h2x, h2y], [h2vx, h2vy]] = hailstones[1];

  const h1grad = (h1vy - rvy) / (h1vx - rvx);
  const h2grad = (h2vy - rvy) / (h2vx - rvx);
  const h1c = h1y - h1grad * h1x;
  const h2c = h2y - h2grad * h2x;
  const startX = Math.round((h2c - h1c) / (h1grad - h2grad));
  const startY = Math.round(h1grad * startX + h1c);
  const t = Math.floor((startX - h1x) / (h1vx - rvx));
  const startZ = h1z + (h1vz - rvz) * t;
  return startX + startY + startZ;
};

console.log('part1', part1());
console.log('part2', part2());
