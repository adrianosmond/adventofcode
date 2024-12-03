import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput().replace(/\n/g, '');
const conditionalInput = input.replace(/don't\(\).*?(do\(\)|$)/g, '');

const findAndSumMultiplications = (inp) =>
  inp
    .match(/mul\(\d\d?\d?,\d\d?\d?\)/g)
    .map((i) => strToIntArray(i.replace('mul(', '').replace(')', ''), ','))
    .reduce((total, [a, b]) => total + a * b, 0);

export const part1 = () => findAndSumMultiplications(input);

export const part2 = () => findAndSumMultiplications(conditionalInput);
