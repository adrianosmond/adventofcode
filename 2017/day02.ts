import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

const digits = input
  .split('\n')
  .map((r) => strToIntArray(r, /\s/).sort((a, b) => a - b));

export const part1 = () =>
  digits.map((r) => r[r.length - 1] - r[0]).reduce(sum);

export const part2 = () =>
  digits
    .map((r) => {
      for (let i = 0; i < r.length - 1; i++) {
        const x = r[i];
        for (let j = i + 1; j < r.length; j++) {
          const y = r[j];
          if (y % x === 0) {
            return y / x;
          }
        }
      }
      throw new Error('Not found');
    })
    .reduce(sum);
