import { sum } from '../utils/reducers.js';
import {
  getNeighbours,
  readInput,
  sortDesc,
  inputToIntGrid,
} from '../utils/functions.js';

const input = readInput();
const grid = inputToIntGrid(input);

const findBasin = (cells, rowIdx, colIdx) => {
  cells.push(`${rowIdx},${colIdx}`);
  const neighbours = getNeighbours(grid, rowIdx, colIdx);
  neighbours.forEach(([r, c, val]) => {
    if (val < 9 && !cells.includes(`${r},${c}`)) {
      findBasin(cells, r, c);
    }
  });
};

const findLowPoints = () => {
  const lowPoints = [];
  grid.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const neighbours = getNeighbours(grid, rowIdx, colIdx);
      if (!neighbours.some(([, , val]) => val <= cell)) {
        lowPoints.push([rowIdx, colIdx]);
      }
    });
  });
  return lowPoints;
};

const lowPoints = findLowPoints();

const part1 = () =>
  lowPoints.map(([row, col]) => grid[row][col]).reduce(sum, lowPoints.length);

const part2 = () => {
  const basins = [];

  lowPoints.forEach(([row, col]) => {
    const cells = [];
    findBasin(cells, row, col);
    basins.push(cells.length);
  });

  basins.sort(sortDesc);
  const [first, second, third] = basins;
  return first * second * third;
};

console.log('part1', part1());
console.log('part2', part2());
