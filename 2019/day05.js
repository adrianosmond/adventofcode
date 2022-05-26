import input from './input05.js';
// array of integers
import { intComputer } from './intComputer.js';

let output;
for (output of intComputer(input, [1]));

console.log('part1:', output);
console.log('part2:', intComputer(input, [5]).next().value);
