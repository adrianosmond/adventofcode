const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input10.txt'), 'utf8');

const jolts = input
  .split('\n')
  .map((n) => parseInt(n, 10))
  .sort((a, b) => a - b);

jolts.push(jolts[jolts.length - 1] + 3);
jolts.unshift(0);

const diffs = new Array(4).fill(0);

const part1 = () => {
  for (let i = 1; i < jolts.length; i++) {
    diffs[jolts[i] - jolts[i - 1]]++;
  }

  return diffs[1] * diffs[3];
};

const part2 = () => {
  const numRoutes = {};

  numRoutes[jolts[jolts.length - 1]] = 1;

  for (let i = jolts.length - 2; i >= 0; i--) {
    numRoutes[jolts[i]] = 0;
    for (let j = i + 1; j < jolts.length && j <= i + 3; j++) {
      if (jolts[j] - jolts[i] <= 3) {
        numRoutes[jolts[i]] += numRoutes[jolts[j]];
      }
    }
  }

  return numRoutes[0];
};

console.log('part1', part1());
console.log('part2', part2());
