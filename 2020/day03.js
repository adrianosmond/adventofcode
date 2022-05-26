import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input03.txt'), 'utf8');
const rows = input.split('\n');

const treesEncountered = (downMovement, rightMovement) => {
  const width = rows[0].length;
  let row = 0;
  let col = 0;
  let numTrees = 0;
  while (row < rows.length) {
    if (rows[row][col] === '#') numTrees++;
    col += rightMovement;
    col %= width;
    row += downMovement;
  }
  return numTrees;
};

const part1 = () => treesEncountered(1, 3);

const part2 = () =>
  treesEncountered(1, 1) *
  treesEncountered(1, 3) *
  treesEncountered(1, 5) *
  treesEncountered(1, 7) *
  treesEncountered(2, 1);

console.log('part1', part1());
console.log('part2', part2());
