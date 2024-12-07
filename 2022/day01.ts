import readInput from '../utils/readInput.ts';
import { sortDesc, strToIntArray } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const elves = input.split('\n\n');
const calories = elves
  .map((elf) => strToIntArray(elf).reduce(sum))
  .sort(sortDesc);

export const part1 = () => calories[0];

export const part2 = () => calories[0] + calories[1] + calories[2];
