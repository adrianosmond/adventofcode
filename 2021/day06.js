import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { sum } from '../utils/reducers.js';
import { strToIntArray } from '../utils/functions.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input06.txt'), 'utf8');
const initialAges = strToIntArray(input, ',');

const countFishAfterDays = (numDays) => {
  const ageCount = new Array(7).fill(0);
  const newbornAgeCount = new Array(9).fill(0);
  initialAges.forEach((age) => ageCount[age]++);
  for (let i = 0; i < numDays; i++) {
    ageCount[i % 7] += newbornAgeCount[i % 9];
    newbornAgeCount[i % 9] = ageCount[i % 7];
  }
  return [...ageCount, ...newbornAgeCount].reduce(sum);
};

const part1 = () => countFishAfterDays(80);

const part2 = () => countFishAfterDays(256);

console.log('part1', part1());
console.log('part2', part2());
