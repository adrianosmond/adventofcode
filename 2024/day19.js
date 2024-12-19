/* eslint-disable no-labels */
import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const [t, p] = input.split('\n\n');
const towels = t.split(', ');
towels.sort((a, b) => b.length - a.length);
const patterns = p.split('\n');

const cache = {};
const countOptions = (pattern, start = 0) => {
  const subPat = pattern.substring(start);
  if (typeof cache[subPat] !== 'undefined') return cache[subPat];

  let numOptions = 0;
  tow: for (const towel of towels) {
    if (start + towel.length > pattern.length) continue;
    for (let i = 0; i < towel.length; i++) {
      if (towel[i] !== pattern[i + start]) continue tow;
    }
    if (start + towel.length === pattern.length) {
      cache[subPat] = 1;
      numOptions++;
      continue;
    }
    const count = countOptions(pattern, start + towel.length);
    numOptions += count;
    cache[subPat] = count;
  }
  cache[subPat] = numOptions;
  return numOptions;
};

export const part1 = () =>
  patterns.filter((pattern) => countOptions(pattern) > 0).length;

export const part2 = () =>
  patterns.map((pattern) => countOptions(pattern)).reduce(sum);
