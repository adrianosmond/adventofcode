import { readInput } from '../utils/functions.js';
import { product } from '../utils/reducers.js';

const input = readInput();

const [races, records] = input
  .replace(/(Time|Distance):/g, '')
  .split('\n')
  .map((line) =>
    line
      .trim()
      .split(/\s+/)
      .map((n) => parseInt(n, 10)),
  );

const getWins = (duration, record) => {
  let wins = 0;
  for (let time = 1; time < duration; time++) {
    if (time * (duration - time) > record) wins++;
  }
  return wins;
};

const part1 = () =>
  races.map((race, i) => getWins(race, records[i])).reduce(product);

const part2 = () =>
  getWins(parseInt(races.join(''), 10), parseInt(records.join(''), 10));

console.log('part1', part1());
console.log('part2', part2());
