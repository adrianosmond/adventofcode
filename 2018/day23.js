import input from './input23.js';

const bots = input
  .replace(/pos=</g, '')
  .replace(/>, r=/g, ',')
  .split('\n')
  .map((n) => n.split(',').map((d) => parseInt(d, 10)));

const manhattan3d = (from, to) =>
  Math.abs(from[0] - to[0]) +
  Math.abs(from[1] - to[1]) +
  Math.abs(from[2] - to[2]);

const biggestRangeBot = bots.reduce((best, bot) =>
  bot[3] > best[3] ? bot : best,
);

const inRangeOfBot = ([fromX, fromY, fromZ, range]) =>
  bots.reduce(
    (tot, [toX, toY, toZ]) =>
      manhattan3d([fromX, fromY, fromZ], [toX, toY, toZ]) <= range
        ? tot + 1
        : tot,
    0,
  );

const inRangeOfPt = ([fromX, fromY, fromZ]) =>
  bots.reduce(
    (tot, [toX, toY, toZ, range]) =>
      manhattan3d([fromX, fromY, fromZ], [toX, toY, toZ]) <= range
        ? tot + 1
        : tot,
    0,
  );

const getMinMaxCoordinate = (list, idx) => {
  let min = list[0][idx];
  let max = list[0][idx];
  for (let i = 1; i < list.length; i++) {
    min = Math.min(min, list[i][idx]);
    max = Math.max(max, list[i][idx]);
  }
  return [min, max];
};

const inRange = inRangeOfBot(biggestRangeBot);

const minRange = getMinMaxCoordinate(bots, 3)[0];

let testRange = 1;
while (testRange < minRange) testRange *= 2;
testRange /= 2;

const home = [0, 0, 0];
let [minX, maxX] = getMinMaxCoordinate(bots, 0);
let [minY, maxY] = getMinMaxCoordinate(bots, 1);
let [minZ, maxZ] = getMinMaxCoordinate(bots, 2);
let bestCount = 0;
let bestCoords = [0, 0, 0];
let bestDist = Number.MAX_VALUE;

while (testRange >= 1) {
  for (let x = minX; x <= maxX; x += testRange) {
    for (let y = minY; y <= maxY; y += testRange) {
      for (let z = minZ; z <= maxZ; z += testRange) {
        const coords = [x, y, z];
        const numInRange = inRangeOfPt(coords);
        const dist = manhattan3d(coords, home);
        if (numInRange > bestCount) {
          bestCount = numInRange;
          bestCoords = coords;
          bestDist = dist;
        } else if (numInRange === bestCount) {
          if (dist < bestDist) {
            bestCount = numInRange;
            bestCoords = coords;
            bestDist = dist;
          }
        }
      }
    }
  }
  minX = bestCoords[0] - testRange;
  maxX = bestCoords[0] + testRange;
  minY = bestCoords[1] - testRange;
  maxY = bestCoords[1] + testRange;
  minZ = bestCoords[2] - testRange;
  maxZ = bestCoords[2] + testRange;
  testRange /= 2;
}

console.log('part1:', inRange);
console.log('part2:', bestDist);
