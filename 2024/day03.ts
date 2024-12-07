import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput().replace(/\n/g, '');
const conditionalInput = input.replace(/don't\(\).*?(do\(\)|$)/g, '');

const findAndSumMultiplications = (inp: string) =>
  inp
    .match(/mul\(\d\d?\d?,\d\d?\d?\)/g)!
    .map(
      (i) =>
        strToIntArray(i.replace('mul(', '').replace(')', ''), ',') as [
          number,
          number,
        ],
    )
    .reduce((total: number, [a, b]) => total + a * b, 0);

export const part1 = () => findAndSumMultiplications(input);

export const part2 = () => findAndSumMultiplications(conditionalInput);
