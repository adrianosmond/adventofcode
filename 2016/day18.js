import { readInput } from '../utils/functions.js';

const input = readInput();
const cols = input.length;

const getChar = (left, center, right) => {
  if (left === '^' && center === '^' && right === '.') {
    return '^';
  }
  if (left === '.' && center === '^' && right === '^') {
    return '^';
  }
  if (left === '^' && center === '.' && right === '.') {
    return '^';
  }
  if (left === '.' && center === '.' && right === '^') {
    return '^';
  }
  return '.';
};

const solve = (maxRows) => {
  let safe = input.split('').filter((c) => c === '.').length;
  let previous = input;
  for (let i = 0; i < maxRows - 1; i++) {
    let current = '';

    for (let j = 0; j < cols; j++) {
      let next;
      if (j === 0) {
        next = getChar('.', previous[0], previous[1]);
      } else if (j === cols - 1) {
        next = getChar(previous[cols - 2], previous[cols - 1], '.');
      } else {
        next = getChar(previous[j - 1], previous[j], previous[j + 1]);
      }
      if (next === '.') safe++;
      current += next;
    }
    previous = current;
  }

  return safe;
};

const part1 = () => solve(40);

const part2 = () => solve(400000);

console.log('part1', part1());
console.log('part2', part2());
