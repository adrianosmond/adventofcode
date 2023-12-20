import readInput from '../utils/readInput.js';

const input = readInput();
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

export const part1 = () => getDepth();

export const part2 = () => firstBasementEntry();
