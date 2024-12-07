import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { product } from '../utils/reducers.ts';

const input = readInput();
const [races, records] = input
  .replace(/(Time|Distance):/g, '')
  .split('\n')
  .map((line) => strToIntArray(line.trim(), /\s+/));

const getWins = (duration: number, record: number) => {
  let wins = 0;
  for (let time = 1; time < duration; time++) {
    if (time * (duration - time) > record) wins++;
  }
  return wins;
};

export const part1 = () =>
  races.map((race, i) => getWins(race, records[i])).reduce(product);

export const part2 = () =>
  getWins(parseInt(races.join(''), 10), parseInt(records.join(''), 10));
