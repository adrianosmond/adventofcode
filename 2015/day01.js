const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input01.txt'), 'utf8');
const instructions = input.split('');

const getDepth = () =>
  instructions.reduce((prev, curr) => (curr === '(' ? prev + 1 : prev - 1), 0);

const firstBasementEntry = () => {
  let floor = 0;
  let position;
  for (position = 1; position < instructions.length; position++) {
    floor += instructions[position - 1] === '(' ? 1 : -1;
    if (floor < 0) break;
  }
  return position;
};

const part1 = () => getDepth();

const part2 = () => firstBasementEntry();

console.log('part1', part1());
console.log('part2', part2());
