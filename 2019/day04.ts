import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = strToIntArray(readInput(), '-');

const [from, to] = input;
const matches = [0, 0];

const testPassword = (password: number) => {
  let number = password;
  let lastDigit = 9;

  const freq = new Array(10).fill(0);
  while (number > 1) {
    const digit = number % 10;
    freq[digit] += 1;
    if (digit > lastDigit) {
      return [false, false];
    }
    number = (number - digit) / 10;
    lastDigit = digit;
  }
  return [Math.max(...freq) > 1, freq.indexOf(2) >= 0];
};

for (let i = from; i <= to; i++) {
  const [ascendingWithConsecutive, ascendingWithStrictDouble] = testPassword(i);
  matches[0] += ascendingWithConsecutive ? 1 : 0;
  matches[1] += ascendingWithStrictDouble ? 1 : 0;
}

export const part1 = () => matches[0];

export const part2 = () => matches[1];
