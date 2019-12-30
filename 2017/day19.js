const input = require('./input19');

const grid = input.split('\n').map(line => line.split(''));
let y = 0;
let x = grid[0].indexOf('|');
let current = grid[y][x];
const direction = [1, 0];
let letters = '';
const nonLetters = [' ', '|', '+', '-'];
let steps = 0;

while (current !== ' ') {
  y += direction[0];
  x += direction[1];
  current = grid[y][x];
  steps++;
  if (!nonLetters.includes(current)) {
    letters += current;
  }
  if (current === '+') {
    if (direction[0] === 0) {
      if (grid[y - 1][x] !== ' ') {
        direction[0] = -1;
      } else {
        direction[0] = 1;
      }
    } else {
      direction[0] = 0;
    }
    if (direction[1] === 0) {
      if (grid[y][x - 1] !== ' ') {
        direction[1] = -1;
      } else {
        direction[1] = 1;
      }
    } else {
      direction[1] = 0;
    }
  }
}

console.log('part1:', letters);
console.log('part2:', steps);
