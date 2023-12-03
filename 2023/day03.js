import { getNeighboursWithDiagonals, readInput } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const numbersFound = [];
const grid = input.split('\n').map((r) => r.split(''));

// Go through the grid, find all the numbers and put them in the numbersFound array
// then replace each digit of the number in the grid with the index of that number
// in numbersFound. We do this because the index is guaranteed to be unique, so when
// we come to look for neighbours, if find the same index twice we know we're looking
// at two cells of the same number. Whereas we can't guarantee that if we only look
// at the values.
for (let r = 0; r < grid.length; r++) {
  let numberStartCol = -1;
  const row = grid[r];
  for (let c = 0; c < row.length; c++) {
    const cell = grid[r][c];
    if (numberStartCol > -1 && (/[^0-9]/.test(cell) || c === row.length - 1)) {
      let numberStr = '';
      for (let n = numberStartCol; n < c; n++) {
        numberStr += row[n];
        row[n] = numbersFound.length;
      }
      if (c === row.length - 1) numberStr += cell;
      numbersFound.push(parseInt(numberStr, 10));
      numberStartCol = -1;
    } else if (numberStartCol === -1 && /[0-9]/.test(cell)) {
      if (c === row.length - 1) {
        row[c] = parseInt(cell, 10);
      } else {
        numberStartCol = c;
      }
    }
  }
}

const getNeighbouringPartNumbers = (row, col) =>
  Array.from(
    new Set(
      getNeighboursWithDiagonals(grid, row, col)
        .map(([, , n]) => n)
        .filter(Number),
    ),
  ).map((n) => numbersFound[n]);

const part1 = () => {
  let total = 0;
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const cell = grid[r][c];
      if (/[^0-9.]/.test(cell)) {
        total += getNeighbouringPartNumbers(r, c).reduce(sum, 0);
      }
    }
  }
  return total;
};

const part2 = () => {
  let total = 0;
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const cell = grid[r][c];
      if (cell === '*') {
        const parts = getNeighbouringPartNumbers(r, c);
        if (parts.length === 2) {
          total += parts[0] * parts[1];
        }
      }
    }
  }
  return total;
};

console.log('part1', part1());
console.log('part2', part2());
