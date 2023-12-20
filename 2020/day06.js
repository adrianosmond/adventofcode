import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const groups = input.split('\n\n');
const letters = new Array(26).fill().map((_, i) => String.fromCharCode(97 + i));

const part1 = () =>
  groups
    .map((group) => group.replace(/\s/g, ''))
    .map((answers) => new Set([...answers]).size)
    .reduce(sum);

const part2 = () =>
  groups
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
