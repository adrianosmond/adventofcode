import { splitAndMapInputLines, strToIntArray } from '../utils/functions.js';
import readInput from '../utils/readInput.js';

const input = readInput();
const bricks = splitAndMapInputLines(input, '~').map((b) =>
  b.map((x) => strToIntArray(x, ',')),
);

const space = {};
const makeKey = (...args) => args.join(',');

bricks.forEach(([[x1, y1, z1], [x2, y2, z2]], bIdx) => {
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      for (let z = z1; z <= z2; z++) {
        space[makeKey(x, y, z)] = bIdx;
      }
    }
  }
});

const settled = bricks.map(() => false);
const supportedBy = bricks.map(() => new Set());
const canDisintegrate = bricks.map(() => true);

let moved = true;
while (moved) {
  moved = false;
  bricks.forEach(([[x1, y1, z1], [x2, y2, z2]], bIdx) => {
    if (z1 === 1 || settled[bIdx]) {
      settled[bIdx] = true;
      return;
    }

    let above = false;
    for (let x = x1; !above && x <= x2; x++) {
      for (let y = y1; !above && y <= y2; y++) {
        if (space[makeKey(x, y, z1 - 1)] >= 0) {
          above = true;
          if (settled[space[makeKey(x, y, z1 - 1)]]) {
            settled[bIdx] = true;
          }
        }
      }
    }
    if (!above) {
      moved = true;
      bricks[bIdx][0][2]--;
      bricks[bIdx][1][2]--;
      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          delete space[makeKey(x, y, z2)];
          space[makeKey(x, y, z1 - 1)] = bIdx;
        }
      }
    }
  });
}

bricks.forEach(([[x1, y1], [x2, y2, z2]], bIdx) => {
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      if (space[makeKey(x, y, z2 + 1)] >= 0) {
        supportedBy[space[makeKey(x, y, z2 + 1)]].add(bIdx);
      }
    }
  }
});

supportedBy
  .map((s) => Array.from(s))
  .filter((s) => s.length === 1)
  .forEach((s) => {
    canDisintegrate[s[0]] = false;
  });

export const part1 = () => canDisintegrate.filter(Boolean).length;

export const part2 = () => {
  const toTest = canDisintegrate.map((b, i) => [b, i]).filter(([b]) => !b);
  let totalBricksDropped = 0;
  toTest.forEach(([, disintegratedIdx]) => {
    const dropping = bricks.map(() => false);
    dropping[disintegratedIdx] = true;
    moved = true;
    while (moved) {
      moved = false;
      supportedBy.forEach((s, bIdx) => {
        const supports = Array.from(s);
        if (dropping[bIdx] || supports.length === 0) return;
        const supportsAreDropping = supports.map((b) => dropping[b]);
        if (supportsAreDropping.every(Boolean)) {
          dropping[bIdx] = true;
          moved = true;
        }
      });
    }
    // -1 because we don't count the disintegrated brick which we marked as dropping
    totalBricksDropped += dropping.filter(Boolean).length - 1;
  });
  return totalBricksDropped;
};
