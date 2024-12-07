import { sum } from '../utils/reducers.ts';
import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();
const frequencies = strToIntArray(input);

export const part1 = () => frequencies.reduce(sum);

export const part2 = () => {
  const visitedFrequencies: Record<number, boolean> = {};
  const foundDuplicate = false;
  let currentFrequency = 0;

  while (!foundDuplicate) {
    for (let i = 0; i < frequencies.length; i++) {
      currentFrequency += frequencies[i];
      if (!visitedFrequencies[currentFrequency]) {
        visitedFrequencies[currentFrequency] = true;
      } else {
        return currentFrequency;
      }
    }
  }
};
