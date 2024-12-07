import readInput from '../utils/readInput.ts';

const input = readInput();
const strings = input.split('\n');

const isNice = (str: string) => {
  if (str.includes('ab')) return false;
  if (str.includes('cd')) return false;
  if (str.includes('pq')) return false;
  if (str.includes('xy')) return false;

  let hasDouble = false;
  for (let i = 1; !hasDouble && i < str.length; i++) {
    if (str[i] === str[i - 1]) hasDouble = true;
  }
  if (!hasDouble) return false;

  return str.replace(/[^aeiou]/g, '').length >= 3;
};

const isNice2 = (str: string) => {
  let hasSpacedDouble = false;
  for (let i = 2; !hasSpacedDouble && i < str.length; i++) {
    if (str[i] === str[i - 2]) hasSpacedDouble = true;
  }
  if (!hasSpacedDouble) return false;

  for (let i = 0; i < str.length - 1; i++) {
    if (str.lastIndexOf(`${str[i]}${str[i + 1]}`) > i + 1) return true;
  }
  return false;
};

export const part1 = () => strings.filter(isNice).length;

export const part2 = () => strings.filter(isNice2).length;
