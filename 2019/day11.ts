import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { intComputer } from './intComputer.ts';

const input = strToIntArray(readInput(), ',');

const MOVEMENTS = [
  [-1, 0], // Left
  [0, 1], // Up
  [1, 0], // Right
  [0, -1], // Down
];

type HullCell = {
  painted: boolean;
  color: number;
};

type Hull = Record<string, HullCell>;

const initialLimits: [number, number, number, number] = [1, -1, 1, -1];

const getLimits = (hull: Hull): [number, number, number, number] =>
  Object.keys(hull)
    .map((c) => strToIntArray(c, ','))
    .reduce(
      (
        [minX, maxX, minY, maxY]: [number, number, number, number],
        [x, y]: number[],
      ): [number, number, number, number] => [
        Math.min(x, minX),
        Math.max(x, maxX),
        Math.min(y, minY),
        Math.max(y, maxY),
      ],
      initialLimits,
    );

const hullRobot = (startColor: number): Hull => {
  let x = 0;
  let y = 0;
  let direction = 1; // Up
  let coords = `${x},${y}`;
  const hull: Hull = {
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

export const part1 = () => Object.values(hullRobot(0)).length;

export const part2 = () => {
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
