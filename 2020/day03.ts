import readInput from '../utils/readInput.ts';

const input = readInput();
const rows = input.split('\n');

const treesEncountered = (downMovement: number, rightMovement: number) => {
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

export const part1 = () => treesEncountered(1, 3);

export const part2 = () =>
  treesEncountered(1, 1) *
  treesEncountered(1, 3) *
  treesEncountered(1, 5) *
  treesEncountered(1, 7) *
  treesEncountered(2, 1);
