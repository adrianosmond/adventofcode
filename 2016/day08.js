import { readInput, strToIntArray } from '../utils/functions.js';

const input = readInput();

const instructions = input.split('\n');

const WIDTH = 50;
const HEIGHT = 6;

const screen = new Array(HEIGHT).fill().map(() => new Array(WIDTH).fill(' '));

const rotateCol = (col, by) => {
  const px = [];
  for (let i = 0; i < HEIGHT; i++) {
    px.push(screen[i][col]);
  }
  for (let i = 0; i < HEIGHT; i++) {
    screen[(i + by) % HEIGHT][col] = px[i];
  }
};

const rotateRow = (row, by) => {
  const px = [];
  for (let i = 0; i < by; i++) {
    px.push(screen[row].pop());
  }
  for (let i = 0; i < by; i++) {
    screen[row].unshift(px.shift());
  }
};

instructions.forEach((instruction) => {
  if (instruction.startsWith('rect')) {
    const dimensions = strToIntArray(instruction.substring(5), 'x');

    for (let w = 0; w < dimensions[0]; w++) {
      for (let h = 0; h < dimensions[1]; h++) {
        screen[h][w] = '#';
      }
    }
  } else if (instruction.startsWith('rotate column')) {
    const [col, by] = strToIntArray(instruction.substring(16), ' by ');
    rotateCol(col, by);
  } else if (instruction.startsWith('rotate row')) {
    const [row, by] = strToIntArray(instruction.substring(13), ' by ');
    rotateRow(row, by);
  }
});

console.log(
  'part1:',
  screen
    .map((r) => r.join(''))
    .join('')
    .replace(/\s/g, '').length,
);
console.log('part2:');
console.log(screen.map((r) => r.join('')).join('\n'));
