import { sum } from '../utils/reducers.ts';
import readInput from '../utils/readInput.ts';
import { getNeighbours, sortDesc, inputToIntGrid } from '../utils/functions.ts';

const input = readInput();
const grid = inputToIntGrid(input);

const findBasin = (cells: string[], rowIdx: number, colIdx: number) => {
  cells.push(`${rowIdx},${colIdx}`);
  const neighbours = getNeighbours(grid, rowIdx, colIdx);
  neighbours.forEach(([r, c, val]) => {
    if (val < 9 && !cells.includes(`${r},${c}`)) {
      findBasin(cells, r, c);
    }
  });
};

const findLowPoints = () => {
  const lowPoints: [number, number][] = [];
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

export const part1 = () =>
  lowPoints.map(([row, col]) => grid[row][col]).reduce(sum, lowPoints.length);

export const part2 = () => {
  const basins: number[] = [];

  lowPoints.forEach(([row, col]) => {
    const cells: string[] = [];
    findBasin(cells, row, col);
    basins.push(cells.length);
  });

  basins.sort(sortDesc);
  const [first, second, third] = basins;
  return first * second * third;
};
