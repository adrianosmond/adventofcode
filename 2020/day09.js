import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { strToIntArray } from '../utils/functions.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input09.txt'), 'utf8');
const numbers = strToIntArray(input);
const PREAMBLE = 25;

const part1 = () => {
  for (let i = PREAMBLE; i < numbers.length; i++) {
    const toValidate = numbers[i];
    const previousNumbers = numbers.slice(i - PREAMBLE, i);

    for (let j = 0; j < previousNumbers.length; j++) {
      if (
        !previousNumbers.some((number) =>
          previousNumbers.includes(toValidate - number),
        )
      ) {
        return toValidate;
      }
    }
  }
};

const part2Target = part1();

const part2 = () => {
  for (let i = 0; i < numbers.length; i++) {
    let total = 0;
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    for (let j = i; j < numbers.length; j++) {
      total += numbers[j];
      min = Math.min(min, numbers[j]);
      max = Math.max(max, numbers[j]);
      if (total === part2Target) {
        return min + max;
      }
      if (total > part2Target) {
        j = numbers.length;
      }
    }
  }
};

console.log('part1', part2Target);
console.log('part2', part2());
