const input = require('./input03'); // multiline string
const { sumByKey } = require('../utils/reducers');

const wires = input.split('\n').map((wire) =>
  wire.split(',').map((instruction) => ({
    direction: instruction[0],
    distance: parseInt(instruction.substring(1), 10),
  })),
);

const manhattan = (x, y) => Math.abs(x) + Math.abs(y);

const directions = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};
const paths = {};
let closestManhattan = Number.MAX_SAFE_INTEGER;
let closestSteps = Number.MAX_SAFE_INTEGER;

const tracePath = (wireKey, steps, distance, startX, startY, xDiff, yDiff) => {
  for (let i = 1; i <= distance; i++) {
    const x = startX + i * xDiff;
    const y = startY + i * yDiff;
    const posKey = `${x},${y}`;

    if (!paths[posKey]) {
      // Never been here before
      paths[posKey] = {
        [wireKey]: {
          steps: steps + i,
        },
      };
    } else if (!paths[posKey][wireKey]) {
      // The other wire has been here before
      paths[posKey][wireKey] = {
        steps: steps + i,
      };

      const manhattanDistance = manhattan(x, y);
      if (manhattanDistance < closestManhattan) {
        closestManhattan = manhattanDistance;
      }

      const stepsDistance = Object.values(paths[posKey]).reduce(
        sumByKey('steps'),
        0,
      );
      if (stepsDistance < closestSteps) {
        closestSteps = stepsDistance;
      }
    }
  }
};

wires.forEach((wire, idx) => {
  const wireKey = `wire${idx}`;
  let x = 0;
  let y = 0;
  let steps = 0;
  wire.forEach(({ distance, direction }) => {
    const [xDiff, yDiff] = directions[direction];
    tracePath(wireKey, steps, distance, x, y, xDiff, yDiff);
    x += distance * xDiff;
    y += distance * yDiff;
    steps += distance;
  });
});

console.log('part1:', closestManhattan);
console.log('part2:', closestSteps);
