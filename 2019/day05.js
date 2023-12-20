import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

export const part1 = () => {
  let output;
  for (output of intComputer(input, [1]));
  return output;
};

export const part2 = () => intComputer(input, [5]).next().value;
