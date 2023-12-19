import { readInput, strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const digits = input
  .split('\n')
  .map((r) => strToIntArray(r, ' ').sort((a, b) => a - b));

const result = digits.map((r) => r[r.length - 1] - r[0]).reduce(sum);
console.log('part1:', result);

const result2 = digits
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
console.log('part2:', result2);
