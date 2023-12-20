import { sum } from '../utils/reducers.js';
import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
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

export const part1 = () => countFishAfterDays(80);

export const part2 = () => countFishAfterDays(256);
