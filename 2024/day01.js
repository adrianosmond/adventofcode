import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { countOccurrences, sum } from '../utils/reducers.js';

const input = readInput();
const lines = input.split('\n');
const numbers = lines.map((l) => strToIntArray(l, /\s+/));

const list1 = numbers.map(([n]) => n).sort();
const list2 = numbers.map(([, n]) => n).sort();

export const part1 = () =>
  list1.map((n, i) => Math.abs(n - list2[i])).reduce(sum);

export const part2 = () => {
  const occurrences = list2.reduce(countOccurrences, {});
  return list1.reduce((total, val) => total + val * (occurrences[val] ?? 0), 0);
};
