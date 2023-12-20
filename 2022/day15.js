import readInput from '../utils/readInput.js';
import { manhattan, strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const beaconsSet = new Set([]);

const sensors = input
  .replace(/Sensor at /g, '')
  .replace(/: closest beacon is at /g, ',')
  .replace(/x=/g, '')
  .replace(/y=/g, '')
  .replace(/, /g, ',')
  .split('\n')
  .map((r) => strToIntArray(r, ','))
  .map(([x1, y1, x2, y2]) => {
    beaconsSet.add([x2, y2].join(','));
    return [x1, y1, manhattan([x1, y1], [x2, y2])];
  });

const targetYRow = 2000000;

const numBeaconsInTargetRowWithinRangeOfSensor = Array.from(beaconsSet)
  .map((b) => strToIntArray(b, ','))
  .filter(([, by]) => by === targetYRow)
  .map((beacon) => {
    for (const sensor of sensors) {
      if (manhattan(beacon, sensor) <= sensor[2]) {
        return 1;
      }
    }
    return 0;
  })
  .reduce(sum);

let maxX = Number.MIN_SAFE_INTEGER;
let maxY = Number.MIN_SAFE_INTEGER;
let minX = Number.MAX_SAFE_INTEGER;
let minY = Number.MAX_SAFE_INTEGER;

sensors.forEach(([x, y, distance]) => {
  minX = Math.min(minX, x - distance);
  minY = Math.min(minY, y - distance);
  maxX = Math.max(maxX, x + distance);
  maxY = Math.max(maxY, y + distance);
});

const part1 = () => {
  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    for (const [sx, sy, distance] of sensors) {
      const xDiff = Math.abs(x - sx);
      const yDiff = Math.abs(targetYRow - sy);
      const manhattanDistance = xDiff + yDiff;

      if (manhattanDistance <= distance) {
        count += sx + distance - yDiff - x + 1;
        x = sx + (distance - yDiff);
        break;
      }
    }
  }

  return count - numBeaconsInTargetRowWithinRangeOfSensor;
};

const part2 = () => {
  for (let y = 0; y <= 4000000; y++) {
    for (let x = 0; x <= 4000000; x++) {
      let found = false;
      for (const [sx, sy, distance] of sensors) {
        const xDiff = Math.abs(x - sx);
        const yDiff = Math.abs(y - sy);
        const manhattanDistance = xDiff + yDiff;
        if (manhattanDistance <= distance) {
          x = sx + (distance - yDiff);
          found = true;
          break;
        }
      }
      if (!found) {
        return 4000000 * x + y;
      }
    }
  }
};

console.log('part1', part1());
console.log('part2', part2());
