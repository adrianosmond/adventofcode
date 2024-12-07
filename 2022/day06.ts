import readInput from '../utils/readInput.ts';

const input = readInput();

const findSequenceOfLength = (length: number) => {
  const chars = input.split('');
  for (let i = length; i < chars.length; i++) {
    if (new Set(chars.slice(i - length, i)).size === length) return i;
  }
  return -1;
};

export const part1 = () => findSequenceOfLength(4);

export const part2 = () => findSequenceOfLength(14);
