import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const makeStonesCount = () =>
  Object.fromEntries(strToIntArray(input, ' ').map((s) => [s, 1]));

const expandStone = (stone) => {
  if (stone === 0) return [1];
  const str = stone.toString();
  if (str.length % 2 === 0) {
    return [
      parseInt(str.substring(0, str.length / 2), 10),
      parseInt(str.substring(str.length / 2, str.length), 10),
    ];
  }
  return [stone * 2024];
};

const expandStones = (stones) => {
  const nextStones = {};
  Object.entries(stones).forEach(([val, count]) => {
    const expanded = expandStone(parseInt(val, 10));
    expanded.forEach((s) => {
      if (!nextStones[s]) nextStones[s] = 0;
      nextStones[s] += count;
    });
  });
  return nextStones;
};

const countStonesAfterNumBlinks = (numBlinks) => {
  let stones = makeStonesCount();
  for (let i = 0; i < numBlinks; i++) {
    stones = expandStones(stones);
  }
  return Object.values(stones).reduce(sum);
};

export const part1 = () => countStonesAfterNumBlinks(25);

export const part2 = () => countStonesAfterNumBlinks(75);
