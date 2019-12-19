const input = require('./input19.js');
const { intComputer } = require('./intComputer');

const SIZE = 50;

let total = 0;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    total += intComputer(input, [x, y]).next().value;
  }
}

console.log('part1:', total);
