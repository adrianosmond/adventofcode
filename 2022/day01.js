import readInput from '../utils/readInput.js';
import { sortDesc, strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const elves = input.split('\n\n');
const calories = elves
  .map((elf) => strToIntArray(elf).reduce(sum))
  .sort(sortDesc);

const part1 = () => calories[0];

const part2 = () => calories[0] + calories[1] + calories[2];

console.log('part1', part1());
console.log('part2', part2());
