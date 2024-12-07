import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { intComputer } from './intComputer.ts';

const input = strToIntArray(readInput(), ',');

export const part1 = () => {
  let output;
  for (output of intComputer(input, [1]));
  return output;
};

export const part2 = () => intComputer(input, [5]).next().value;
