import readInput from '../utils/readInput.js';

const input = readInput();

const findSequenceOfLength = (length) => {
  const chars = input.split('');
  for (let i = length; i < chars.length; i++) {
    if (new Set(chars.slice(i - length, i)).size === length) return i;
  }
  return -1;
};

export const part1 = () => findSequenceOfLength(4);

export const part2 = () => findSequenceOfLength(14);
