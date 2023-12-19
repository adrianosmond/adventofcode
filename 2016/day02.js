import { readInput, inputToCharGrid } from '../utils/functions.js';

const input = readInput();

const instructions = inputToCharGrid(input);

const directions = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

const day2part1 = () => {
  const keypad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const position = [1, 1];
  let keycode = 0;

  instructions.forEach((line) => {
    line.forEach((direction) => {
      position[0] += directions[direction][0];
      position[1] += directions[direction][1];
      if (position[0] < 0) position[0] = 0;
      if (position[1] < 0) position[1] = 0;
      if (position[0] > 2) position[0] = 2;
      if (position[1] > 2) position[1] = 2;
    });
    keycode *= 10;
    keycode += keypad[position[0]][position[1]];
  });
  return keycode;
};

const day2part2 = () => {
  const keypad = [
    [-1, -1, 1, -1, -1],
    [-1, 2, 3, 4, -1],
    [5, 6, 7, 8, 9],
    [-1, 'A', 'B', 'C', -1],
    [-1, -1, 'D', -1, -1],
  ];

  const position = [2, 0];
  let keycode = '';

  instructions.forEach((line) => {
    line.forEach((direction) => {
      position[0] += directions[direction][0];
      position[1] += directions[direction][1];
      if (position[0] < 0) position[0] = 0;
      if (position[1] < 0) position[1] = 0;
      if (position[0] > 4) position[0] = 4;
      if (position[1] > 4) position[1] = 4;
      if (keypad[position[0]][position[1]] === -1) {
        position[0] -= directions[direction][0];
        position[1] -= directions[direction][1];
      }
    });
    keycode += keypad[position[0]][position[1]];
  });
  return keycode;
};

console.log('part1:', day2part1());
console.log('part2:', day2part2());
