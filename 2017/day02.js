const input = require('./input02');
const { sum } = require('../utils/reducers');

const digits = input.split('\n').map((r) =>
  r
    .split(' ')
    .map((x) => parseInt(x, 10))
    .sort((a, b) => a - b),
);

const result = digits.map((r) => r[r.length - 1] - r[0]).reduce(sum);
console.log('part1:', result);

const result2 = digits
  .map((r) => {
    for (let i = 0; i < r.length - 1; i++) {
      const x = r[i];
      for (let j = i + 1; j < r.length; j++) {
        const y = r[j];
        if (y % x === 0) {
          return y / x;
        }
      }
    }
    throw new Error('Not found');
  })
  .reduce(sum);
console.log('part2:', result2);
