const input = require('./input01'); // multi line string
const { sum } = require('../utils/reducers');

const frequencies = input.split('\n').map((f) => parseInt(f, 10));
const resultingFrequency = frequencies.reduce(sum);

const visitedFrequencies = {};
let foundDuplicate = false;
let firstRepeatedFrequency;
let currentFrequency = 0;

while (!foundDuplicate) {
  for (let i = 0; i < frequencies.length; i++) {
    currentFrequency += frequencies[i];
    if (!visitedFrequencies[currentFrequency]) {
      visitedFrequencies[currentFrequency] = true;
    } else {
      foundDuplicate = true;
      firstRepeatedFrequency = currentFrequency;
      break;
    }
  }
}

console.log('part1:', resultingFrequency);
console.log('part2:', firstRepeatedFrequency);
