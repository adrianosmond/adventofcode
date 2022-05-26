import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { sum } from '../utils/reducers.js';
import { strToIntArray } from '../utils/functions.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input10.txt'), 'utf8');

const jolts = strToIntArray(input).sort((a, b) => a - b);

jolts.unshift(0);
jolts.push(Math.max(...jolts) + 3);

const part1 = () => {
  const differences = jolts.map((current, i) => jolts[i + 1] - current);

  return (
    differences.filter((d) => d === 1).length *
    differences.filter((d) => d === 3).length
  );
};

const part2 = () => {
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

console.log('part1', part1());
console.log('part2', part2());
