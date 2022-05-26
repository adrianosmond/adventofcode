import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input05.txt'), 'utf8');
const strings = input.split('\n');

const isNice = (str) => {
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

const isNice2 = (str) => {
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

const part1 = () => strings.filter(isNice).length;

const part2 = () => strings.filter(isNice2).length;

console.log('part1', part1());
console.log('part2', part2());
