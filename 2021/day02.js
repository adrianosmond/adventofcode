import { readInput } from '../utils/functions.js';

const input = readInput();

const instructions = input.split('\n').map((line) => {
  const [, instruction, amount] = line.match(/([a-z]+) ([0-9]+)/);
  return [instruction, parseInt(amount, 10)];
});

const part1 = () => {
  let horizontal = 0;
  let depth = 0;
  instructions.forEach(([instruction, amount]) => {
    switch (instruction) {
      case 'forward':
        horizontal += amount;
        break;
      case 'up':
        depth -= amount;
        break;
      case 'down':
        depth += amount;
        break;
      default:
    }
  });
  return horizontal * depth;
};

const part2 = () => {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  instructions.forEach(([instruction, amount]) => {
    switch (instruction) {
      case 'forward':
        horizontal += amount;
        depth += aim * amount;
        break;
      case 'up':
        aim -= amount;
        break;
      case 'down':
        aim += amount;
        break;
      default:
    }
  });
  return horizontal * depth;
};

console.log('part1', part1());
console.log('part2', part2());
