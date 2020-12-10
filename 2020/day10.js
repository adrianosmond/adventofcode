const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input10.txt'), 'utf8');

const jolts = input
  .split('\n')
  .map((n) => parseInt(n, 10))
  .sort((a, b) => a - b);

jolts.push(jolts[jolts.length - 1] + 3);
jolts.unshift(0);

const part1 = () => {
  const differences = jolts.map((current, i) => jolts[i + 1] - current);

  return (
    differences.filter((d) => d === 1).length *
    differences.filter((d) => d === 3).length
  );
};

const part2 = () => {
  const numRoutes = Object.fromEntries(jolts.map((j) => [j, 0]));
  const reversedJolts = [...jolts].reverse();

  numRoutes[reversedJolts[0]] = 1;

  reversedJolts.forEach((jolt) => {
    const possibleJumps = jolts.filter(
      (jump) => jump > jolt && jump - jolt <= 3,
    );

    numRoutes[jolt] += possibleJumps.reduce(
      (totalRoutes, jump) => totalRoutes + numRoutes[jump],
      0,
    );
  });

  return numRoutes[0];
};

console.log('part1', part1());
console.log('part2', part2());
