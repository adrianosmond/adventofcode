import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();

const instructions = input.split('\n');

const WIDTH = 50;
const HEIGHT = 6;

const screen: string[][] = new Array(HEIGHT)
  .fill(null)
  .map(() => new Array(WIDTH).fill(' '));

const rotateCol = (col: number, by: number) => {
  const px = [];
  for (let i = 0; i < HEIGHT; i++) {
    px.push(screen[i][col]);
  }
  for (let i = 0; i < HEIGHT; i++) {
    screen[(i + by) % HEIGHT][col] = px[i];
  }
};

const rotateRow = (row: number, by: number) => {
  const px = [];
  for (let i = 0; i < by; i++) {
    const popped = screen[row].pop();
    if (popped === undefined) throw new Error('Unexpected empty row');
    px.push(popped);
  }
  for (let i = 0; i < by; i++) {
    const shifted = px.shift();
    if (shifted === undefined) throw new Error('Unexpected empty px array');
    screen[row].unshift(shifted);
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

export const part1 = () =>
  screen
    .map((r) => r.join(''))
    .join('')
    .replace(/\s/g, '').length;

export const part2 = () => screen.map((r) => r.join('')).join('\n');
