import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { strToIntArray } from '../utils/functions.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input01.txt'), 'utf8');

const depths = strToIntArray(input);

const getTimesIncreased = (arr) =>
  arr.reduce((timesIncreased, curr, idx) => {
    if (idx === 0) return 0;
    return timesIncreased + (curr > arr[idx - 1] ? 1 : 0);
  }, 0);

const part1 = () => getTimesIncreased(depths);

const part2 = () => {
  const summed = depths
    .map((depth, idx) => {
      if (idx < 2) return false;
      return depth + depths[idx - 1] + depths[idx - 2];
    })
    .filter(Boolean);

  return getTimesIncreased(summed);
};

console.log('part1', part1());
console.log('part2', part2());
