const input = require('./input05'); // array of integers
const { intComputer } = require('./intComputer');

let output;
for (output of intComputer(input, [1]));

console.log('part1:', output);
console.log('part2:', intComputer(input, [5]).next().value);
