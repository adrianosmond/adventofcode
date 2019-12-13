const input = require('./input09'); // Array of integers
const { intComputer } = require('./intComputer');

for (const output of intComputer(input, [1])) {
  console.log('part1:', output);
}

for (const output of intComputer(input, [2])) {
  console.log('part2:', output);
}
