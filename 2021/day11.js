import readInput from '../utils/readInput.js';
import { inputToIntGrid } from '../utils/functions.js';

const input = readInput();

const flash = (row, col, levels) => {
  const maxRow = levels.length - 1;
  const maxCol = levels[0].length - 1;
  if (row > 0 && col > 0) levels[row - 1][col - 1]++;
  if (row > 0) levels[row - 1][col]++;
  if (row > 0 && col < maxCol) levels[row - 1][col + 1]++;
  if (col > 0) levels[row][col - 1]++;
  if (col < maxCol) levels[row][col + 1]++;
  if (row < maxRow && col > 0) levels[row + 1][col - 1]++;
  if (row < maxRow) levels[row + 1][col]++;
  if (row < maxRow && col < maxCol) levels[row + 1][col + 1]++;
};

const simulateFlashes = (part2 = false) => {
  const levels = inputToIntGrid(input);
  let step;
  let numFlashes = 0;
  for (step = 1; step < 1000; step++) {
    for (let r = 0; r < levels.length; r++) {
      for (let c = 0; c < levels[r].length; c++) {
        levels[r][c]++;
      }
    }

    const flashed = [];
    let prevNumFlashed = -1;
    while (prevNumFlashed !== flashed.length) {
      prevNumFlashed = flashed.length;
      for (let r = 0; r < levels.length; r++) {
        for (let c = 0; c < levels[r].length; c++) {
          if (levels[r][c] < 10 || flashed.includes(`${r},${c}`)) continue;
          flashed.push(`${r},${c}`);
          flash(r, c, levels);
        }
      }
    }

    for (let r = 0; r < levels.length; r++) {
      for (let c = 0; c < levels[r].length; c++) {
        if (levels[r][c] > 9) {
          levels[r][c] = 0;
        }
      }
    }

    numFlashes += flashed.length;
    if (step === 100 && !part2) return numFlashes;
    if (flashed.length === levels.length * levels[0].length) return step;
  }
};

export const part1 = () => simulateFlashes();

export const part2 = () => simulateFlashes(true);
