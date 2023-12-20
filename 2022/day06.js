import readInput from '../utils/readInput.js';

const input = readInput();

const findSequenceOfLength = (length) => {
  const chars = input.split('');
  for (let i = length; i < chars.length; i++) {
    if (new Set(chars.slice(i - length, i)).size === length) return i;
  }
  return -1;
};

const part1 = () => findSequenceOfLength(4);

const part2 = () => findSequenceOfLength(14);

console.log('part1', part1());
console.log('part2', part2());
