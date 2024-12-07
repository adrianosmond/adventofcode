import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();

const positions = strToIntArray(input, ',');
const min = Math.min(...positions);
const max = Math.max(...positions);

export const part1 = () => {
  let bestCost = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i++) {
    let cost = 0;
    positions.forEach((pos) => {
      cost += Math.abs(pos - i);
    });

    if (cost < bestCost) bestCost = cost;
  }

  return bestCost;
};

export const part2 = () => {
  let bestCost = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i++) {
    let cost = 0;
    positions.forEach((pos) => {
      const diff = Math.abs(pos - i);
      cost += (diff * (diff + 1)) / 2;
    });

    if (cost < bestCost) bestCost = cost;
  }

  return bestCost;
};
