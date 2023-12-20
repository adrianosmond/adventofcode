import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

export const part1 = () => {
  const SIZE = 50;

  let total = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      total += intComputer(input, [x, y]).next().value;
    }
  }
  return total;
};

export const part2 = () => {
  const SIZE_2 = 99;
  let x = 0;
  let y = SIZE_2;

  while (true) {
    const bottomLeft = intComputer(input, [x, y]).next().value;
    if (bottomLeft) {
      const topRight = intComputer(input, [x + SIZE_2, y - SIZE_2]).next()
        .value;
      if (topRight) {
        return 10000 * x + (y - SIZE_2);
      }
      y++;
    } else {
      x++;
    }
  }
};
