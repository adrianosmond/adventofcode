import input from './input09.js';
// Array of integers
import { intComputer } from './intComputer.js';

for (const output of intComputer(input, [1])) {
  console.log('part1:', output);
}

for (const output of intComputer(input, [2])) {
  console.log('part2:', output);
}
