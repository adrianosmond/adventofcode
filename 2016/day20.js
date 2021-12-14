const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.resolve(__dirname, 'input20.txt'), 'utf8');
const ranges = input
  .split('\n')
  .map((row) => row.split('-').map((n) => parseInt(n, 10)))
  .sort((a, b) => a[0] - b[0]);

for (let i = 0; i < ranges.length - 1; i++) {
  if (ranges[i][1] > ranges[i + 1][1]) {
    ranges.splice(i + 1, 1);
    i--;
  } else if (ranges[i][1] + 1 >= ranges[i + 1][0]) {
    ranges[i][1] = ranges[i + 1][1];
    ranges.splice(i + 1, 1);
    i--;
  }
}

const part1 = () => ranges[0][1] + 1;

const part2 = () => {
  let allowed = 0;
  for (let i = 0; i < ranges.length - 1; i++) {
    allowed += ranges[i + 1][0] - ranges[i][1] - 1;
  }
  return allowed;
};

console.log('part1', part1());
console.log('part2', part2());