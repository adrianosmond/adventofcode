import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
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
