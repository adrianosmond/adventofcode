const fs = require('fs');
const path = require('path');
const { sum } = require('../utils/reducers');

const input = fs.readFileSync(path.resolve(__dirname, 'input02.txt'), 'utf8');
const dimensions = input.split('\n').map((r) =>
  r
    .split('x')
    .map((x) => parseInt(x, 10))
    .sort((a, b) => a - b),
);

const getArea = ([w, h, l]) => 2 * w * h + 2 * h * l + 2 * l * w + w * h;
const getLength = ([w, h, l]) => 2 * w + 2 * h + w * h * l;

const part1 = () => dimensions.map(getArea).reduce(sum);

const part2 = () => dimensions.map(getLength).reduce(sum);

console.log('part1', part1());
console.log('part2', part2());
