const input = require('./input01'); // multi line string

const frequencies = input.split('\n').map(f => parseInt(f, 10));
const resultingFrequency = frequencies.reduce((a, b) => a + b);

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

console.log('part 1:', resultingFrequency);
console.log('part 2:', firstRepeatedFrequency);
