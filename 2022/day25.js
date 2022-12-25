import { readInput } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const numbers = input.split('\n');

const maxes = [2];
for (let i = 1; i < 25; i++) {
  maxes.push(maxes[i - 1] + 2 * 5 ** i);
}

const toDecimal = (number) =>
  number
    .split('')
    .reverse()
    .reduce((total, digit, idx) => {
      const val = 5 ** idx;
      if (digit === '-') return total - val;
      if (digit === '=') return total - 2 * val;
      return total + parseInt(digit, 10) * val;
    }, 0);

const findSnafuValue = (target, powerIdx) => {
  if (Math.abs(target) > maxes[powerIdx]) return false;
  if (powerIdx === 0) {
    if (target === -2) return '=';
    if (target === -1) return '-';
    if (target === 0) return '0';
    if (target === 1) return '1';
    if (target === 2) return '2';
    return false;
  }

  const power = 5 ** powerIdx;
  let snafu = '';
  snafu = findSnafuValue(target - 2 * power, powerIdx - 1);
  if (snafu) return `2${snafu}`;
  snafu = findSnafuValue(target - power, powerIdx - 1);
  if (snafu) return `1${snafu}`;
  snafu = findSnafuValue(target, powerIdx - 1);
  if (snafu) return `0${snafu}`;
  snafu = findSnafuValue(target + power, powerIdx - 1);
  if (snafu) return `-${snafu}`;
  snafu = findSnafuValue(target + 2 * power, powerIdx - 1);
  if (snafu) return `=${snafu}`;
  return false;
};

const toSnafu = (number) => {
  const pow = maxes.findIndex((x) => x >= Math.abs(number));
  return findSnafuValue(number, pow);
};

const part1 = () => toSnafu(numbers.map(toDecimal).reduce(sum));

console.log('part1', part1());
