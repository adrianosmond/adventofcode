import readInput from '../utils/readInput.js';

const input = readInput();

const instructions = input.split('\n').map((line) => {
  const [, instruction, amount] = line.match(/([a-z]+) ([0-9]+)/);
  return [instruction, parseInt(amount, 10)];
});

export const part1 = () => {
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

export const part2 = () => {
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
