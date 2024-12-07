import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

const groups = input.split('\n\n');
const letters = new Array(26)
  .fill(0)
  .map((_, i) => String.fromCharCode(97 + i));

export const part1 = () =>
  groups
    .map((group) => group.replace(/\s/g, ''))
    .map((answers) => new Set([...answers]).size)
    .reduce(sum);

export const part2 = () =>
  groups
    .map((group) =>
      letters.reduce(
        (count, letter) =>
          group.replace(new RegExp(`[^${letter}]`, 'g'), '').length ===
          group.split('\n').length
            ? count + 1
            : count,
        0,
      ),
    )
    .reduce(sum);
