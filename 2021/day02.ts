import readInput from '../utils/readInput.ts';

const input = readInput();

const instructions: [string, number][] = input.split('\n').map((line) => {
  const match = line.match(/([a-z]+) ([0-9]+)/);
  if (!match) throw new Error('Invalid instruction');
  const [, instruction, amount] = match;
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
