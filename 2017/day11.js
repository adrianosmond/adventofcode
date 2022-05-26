import { readInput } from '../utils/functions.js';

const input = readInput();

const instructions = input.split(',');

const distance = (x, y) => {
  const absX = Math.abs(x);
  const absY = Math.abs(y);
  if (absX === absY) {
    return absX;
  }
  if (absY > absX) {
    return absX + (absY - absX) / 2;
  }
  const avg = (absX + absY) / 2;
  return avg - absY + avg;
};

let x = 0;
let y = 0;

let max = 0;

instructions.forEach((i) => {
  if (i === 'n') {
    y += 2;
  } else if (i === 'nw') {
    y += 1;
    x -= 1;
  } else if (i === 'ne') {
    y += 1;
    x += 1;
  } else if (i === 's') {
    y -= 2;
  } else if (i === 'se') {
    y -= 1;
    x += 1;
  } else if (i === 'sw') {
    y -= 1;
    x -= 1;
  }
  max = Math.max(max, distance(x, y));
});

console.log('part1:', distance(x, y));
console.log('part2:', max);
