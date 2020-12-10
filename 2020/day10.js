const fs = require('fs');
const path = require('path');
const { strToIntArray } = require('../utils/functions');
const { sum } = require('../utils/reducers');

const input = fs.readFileSync(path.resolve(__dirname, 'input10.txt'), 'utf8');

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
