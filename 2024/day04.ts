import readInput from '../utils/readInput.ts';
import {
  getNeighboursWithDiagonals,
  inputToCharGrid,
  iterateOverGrid,
} from '../utils/functions.ts';

const input = readInput();

const grid = inputToCharGrid(input);
const gridHeight = grid.length;
const gridWidth = grid[0].length;

const checkMatch = (row: number, col: number, rDiff: number, cDiff: number) => {
  const letters = ['M', 'A', 'S'];
  let r = row;
  let c = col;
  for (let i = 0; i < letters.length; i++) {
    r += rDiff;
    c += cDiff;
    if (grid[r][c] !== letters[i]) return 0;
  }
  return 1;
};

export const part1 = () => {
  let matches = 0;
  for (const [cell, row, col] of iterateOverGrid(grid)) {
    if (cell !== 'X') continue;
    if (row >= 3) {
      // up is available
      matches += checkMatch(row, col, -1, 0);
      // up-left is available
      if (col >= 3) matches += checkMatch(row, col, -1, -1);
      // up-right is available
      if (col < gridWidth - 3) matches += checkMatch(row, col, -1, 1);
    }

    if (row < gridHeight - 3) {
      // down is available
      matches += checkMatch(row, col, 1, 0);
      // down-left is available
      if (col >= 3) matches += checkMatch(row, col, 1, -1);
      // down-right is available
      if (col < gridWidth - 3) matches += checkMatch(row, col, 1, 1);
    }

    // left is available
    if (col >= 3) matches += checkMatch(row, col, 0, -1);
    // right is available
    if (col < gridWidth - 3) matches += checkMatch(row, col, 0, 1);
  }
  return matches;
};

export const part2 = () => {
  let matches = 0;
  for (const [cell, row, col] of iterateOverGrid(grid)) {
    if (
      row === 0 ||
      col === 0 ||
      row === gridHeight - 1 ||
      col === gridWidth - 1 ||
      cell !== 'A'
    )
      continue;

    const [, , , , [, , dr], [, , dl], [, , ur], [, , ul]] =
      getNeighboursWithDiagonals(grid, row, col);
    const positiveDiagonalMatches =
      (ur === 'M' && dl === 'S') || (ur === 'S' && dl === 'M');
    const negativeDiagonalMatches =
      (ul === 'M' && dr === 'S') || (ul === 'S' && dr === 'M');

    if (positiveDiagonalMatches && negativeDiagonalMatches) matches += 1;
  }
  return matches;
};
