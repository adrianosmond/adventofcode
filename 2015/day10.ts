import readInput from '../utils/readInput.ts';

const input = readInput();

const lookAndSay = (number: string) => {
  let current = number[0];
  let result = '';
  let count = 0;
  for (let i = 0; i < number.length; i++) {
    if (number[i] !== current && count > 0) {
      result += count + current;
      count = 1;
      current = number[i];
    } else {
      count++;
    }
  }
  result += count + current;
  return result;
};

export const part1 = () => {
  let current = input;
  for (let i = 0; i < 40; i++) {
    current = lookAndSay(current);
  }
  return current.length;
};

export const part2 = () => {
  let current = input;
  for (let i = 0; i < 50; i++) {
    current = lookAndSay(current);
  }
  return current.length;
};
