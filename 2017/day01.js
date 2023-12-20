import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const captcha = strToIntArray(input, '');

console.log(
  'part1;',
  captcha.reduce(
    (tot, curr, idx) =>
      tot + (curr === captcha[(idx + 1) % captcha.length] ? curr : 0),
    0,
  ),
);
console.log(
  'part2;',
  captcha.reduce(
    (tot, curr, idx) =>
      tot +
      (curr === captcha[(idx + captcha.length / 2) % captcha.length]
        ? curr
        : 0),
    0,
  ),
);
