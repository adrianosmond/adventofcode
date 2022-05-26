const fs = require('fs');
const path = require('path');
const { sum } = require('../utils/reducers');

const input = fs.readFileSync(path.resolve(__dirname, 'input08.txt'), 'utf8');
const strings = input.split('\n');

const totalStringLength = strings.map((s) => s.length).reduce(sum);

const getUnescapedLength = (s) =>
  s
    .substr(1, s.length - 2)
    .replace(/\\x[0-9a-f]{2}/g, 'X')
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"').length;

const getEscapedLength = (s) =>
  s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').length + 2;

const part1 = () =>
  totalStringLength - strings.map(getUnescapedLength).reduce(sum);

const part2 = () =>
  strings.map(getEscapedLength).reduce(sum) - totalStringLength;

console.log('part1', part1());
console.log('part2', part2());
