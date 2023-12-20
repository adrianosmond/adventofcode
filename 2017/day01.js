import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const captcha = strToIntArray(input, '');

export const part1 = () =>
  captcha.reduce(
    (tot, curr, idx) =>
      tot + (curr === captcha[(idx + 1) % captcha.length] ? curr : 0),
    0,
  );

export const part2 = () =>
  captcha.reduce(
    (tot, curr, idx) =>
      tot +
      (curr === captcha[(idx + captcha.length / 2) % captcha.length]
        ? curr
        : 0),
    0,
  );
