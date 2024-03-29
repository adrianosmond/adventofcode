import readInput from '../utils/readInput.js';
import { sortAsc, strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const jolts = strToIntArray(input).sort(sortAsc);

jolts.unshift(0);
jolts.push(Math.max(...jolts) + 3);

export const part1 = () => {
  const differences = jolts.map((current, i) => jolts[i + 1] - current);

  return (
    differences.filter((d) => d === 1).length *
    differences.filter((d) => d === 3).length
  );
};

export const part2 = () => {
  const ways = {};
  const reversedJolts = [...jolts].reverse();

  reversedJolts.forEach((jolt) => {
    const possibleJumps = jolts.filter(
      (jump) => jump > jolt && jump <= jolt + 3,
    );

    ways[jolt] = possibleJumps.map((jump) => ways[jump]).reduce(sum, 0) || 1;
  });

  return ways[0];
};
