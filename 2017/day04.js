const input = require('./input04');
const { sum } = require('../utils/reducers');

const passphrases = input.split('\n').map((r) => r.split(' ').sort());
const alphabetised = passphrases.map((r) =>
  r.map((w) => w.split('').sort().join('')).sort(),
);

const removeDuplicates = (words) => {
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] === words[i + 1]) {
      return 0;
    }
  }
  return 1;
};

console.log('part1:', passphrases.map(removeDuplicates).reduce(sum));
console.log('part2:', alphabetised.map(removeDuplicates).reduce(sum));
