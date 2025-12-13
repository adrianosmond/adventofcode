import readInput from '../utils/readInput.js';

// const input = `L68
// L30
// R48
// L5
// R60
// L55
// L1
// L99
// R14
// L82`;
// const input = `L150
// L50`;
const input = readInput();
const numbers = input
  .split('\n')
  .map((line) =>
    parseInt(`${line[0] === 'L' ? '-' : ''}${line.substring(1)}`, 10),
  );

export const part1 = () => {
  let dial = 50;
  let count = 0;
  for (const num of numbers) {
    dial += num;
    dial %= 100;
    if (dial === 0) count++;
  }
  return count;
};

export const part2 = () => {
  let dial = 50;
  let count = 0;
  for (const num of numbers) {
    if (num < 0) {
      for (let i = 0; i < Math.abs(num); i++) {
        dial -= 1;
        if (dial === 0) count++;
        if (dial < 0) dial = 99;
      }
    } else {
      dial += num;
      while (dial > 99) {
        dial -= 100;
        count++;
      }
    }
  }
  return count;
};
