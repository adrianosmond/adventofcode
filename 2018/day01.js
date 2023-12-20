import { sum } from '../utils/reducers.js';
import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const frequencies = strToIntArray(input);

export const part1 = () => frequencies.reduce(sum);

export const part2 = () => {
  const visitedFrequencies = {};
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
