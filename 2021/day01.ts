import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();
const depths = strToIntArray(input);

const getTimesIncreased = (arr: number[]) =>
  arr.reduce((timesIncreased, curr, idx) => {
    if (idx === 0) return 0;
    return timesIncreased + (curr > arr[idx - 1] ? 1 : 0);
  }, 0);

export const part1 = () => getTimesIncreased(depths);

export const part2 = () => {
  const summed = depths
    .map((depth, idx) => {
      if (idx < 2) return false;
      return depth + depths[idx - 1] + depths[idx - 2];
    })
    .filter(Boolean) as number[];

  return getTimesIncreased(summed);
};
