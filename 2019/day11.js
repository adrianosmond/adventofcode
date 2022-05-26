import input from './input11.js';

import { intComputer } from './intComputer.js';

const MOVEMENTS = [
  [-1, 0], // Left
  [0, 1], // Up
  [1, 0], // Right
  [0, -1], // Down
];

const getLimits = (hull) =>
  Object.keys(hull)
    .map((c) => c.split(',').map((i) => parseInt(i, 10)))
    .reduce(
      ([minX, maxX, minY, maxY], [x, y]) => [
        Math.min(x, minX),
        Math.max(x, maxX),
        Math.min(y, minY),
        Math.max(y, maxY),
      ],
      [1, -1, 1, -1],
    );

const hullRobot = (startColor) => {
  let x = 0;
  let y = 0;
  let direction = 1; // Up
  let coords = `${x},${y}`;
  const hull = {
    '0,0': { painted: false, color: startColor },
  };

  const inputs = [startColor];
  let outputIdx = 0;
  for (const output of intComputer(input, inputs)) {
    if (outputIdx % 2 === 0) {
      hull[coords] = { painted: true, color: output };
    } else {
      direction = (direction + (output === 0 ? 3 : 1)) % 4;
      x += MOVEMENTS[direction][0];
      y += MOVEMENTS[direction][1];
      coords = `${x},${y}`;
      if (!hull[coords]) {
        hull[coords] = { painted: false, color: 0 };
      }
      inputs.push(hull[coords].color);
    }
    outputIdx++;
  }
  return hull;
};

const day11part2 = () => {
  const hull = hullRobot(1);
  const [minX, maxX, minY, maxY] = getLimits(hull);
  let painting = '';

  for (let y = maxY; y >= minY; y--) {
    painting += '\n';
    for (let x = minX; x <= maxX; x++) {
      const coords = `${x},${y}`;
      painting += !hull[coords] || hull[coords].color === 0 ? ' ' : '#';
    }
  }

  return painting;
};

console.log('part1:', Object.values(hullRobot(0)).length);
console.log('part2:', day11part2());
