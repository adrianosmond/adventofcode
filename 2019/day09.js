import { readInput, strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

for (const output of intComputer(input, [1])) {
  console.log('part1:', output);
}

for (const output of intComputer(input, [2])) {
  console.log('part2:', output);
}
