import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

let output;
for (output of intComputer(input, [1]));

console.log('part1:', output);
console.log('part2:', intComputer(input, [5]).next().value);
