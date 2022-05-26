import { readInput, strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

const SIZE = 50;

let total = 0;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    total += intComputer(input, [x, y]).next().value;
  }
}

console.log('part1:', total);

const SIZE_2 = 99;
let x = 0;
let y = SIZE_2;

while (true) {
  const bottomLeft = intComputer(input, [x, y]).next().value;
  if (bottomLeft) {
    const topRight = intComputer(input, [x + SIZE_2, y - SIZE_2]).next().value;
    if (topRight) {
      console.log('part2:', 10000 * x + (y - SIZE_2));
      break;
    } else {
      y++;
    }
  } else {
    x++;
  }
}
