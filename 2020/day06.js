const fs = require('fs');
const path = require('path');
const { sum } = require('../utils/reducers');

const input = fs
  .readFileSync(path.resolve(__dirname, 'input06.txt'), 'utf8')
  .split('\n\n');

const letters = new Array(26).fill().map((_, i) => String.fromCharCode(97 + i));

const part1 = () =>
  input
    .map((group) => group.replace(/\s/g, ''))
    .map((answers) => new Set([...answers]).size)
    .reduce(sum);

const part2 = () =>
  input
    .map((group) =>
      letters.reduce(
        (count, letter) =>
          group.replace(new RegExp(`[^${letter}]`, 'g'), '').length ===
          group.split('\n').length
            ? count + 1
            : count,
        0,
      ),
    )
    .reduce(sum);

console.log('part1', part1());
console.log('part2', part2());
