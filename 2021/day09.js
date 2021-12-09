const fs = require('fs');
const path = require('path');
const { sum } = require('../utils/reducers');

const input = fs.readFileSync(path.resolve(__dirname, 'input09.txt'), 'utf8');

const grid = input
  .split('\n')
  .map((r) => r.split('').map((n) => parseInt(n, 10)));

const getNeighbours = (rowIdx, colIdx) => {
  const neighbours = [];
  if (rowIdx < grid.length - 1)
    neighbours.push([grid[rowIdx + 1][colIdx], rowIdx + 1, colIdx]);
  if (rowIdx > 0)
    neighbours.push([grid[rowIdx - 1][colIdx], rowIdx - 1, colIdx]);
  if (colIdx < grid[0].length - 1)
    neighbours.push([grid[rowIdx][colIdx + 1], rowIdx, colIdx + 1]);
  if (colIdx > 0)
    neighbours.push([grid[rowIdx][colIdx - 1], rowIdx, colIdx - 1]);
  return neighbours;
};

const findBasin = (cells, rowIdx, colIdx) => {
  cells.push(`${rowIdx},${colIdx}`);
  const neighbours = getNeighbours(rowIdx, colIdx);
  neighbours.forEach(([val, r, c]) => {
    if (val < 9 && !cells.includes(`${r},${c}`)) {
      findBasin(cells, r, c);
    }
  });
};

const findLowPoints = () => {
  const lowPoints = [];
  grid.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const neighbours = getNeighbours(rowIdx, colIdx);
      if (!neighbours.some(([val]) => val <= cell)) {
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

  basins.sort((a, b) => b - a);
  const [first, second, third] = basins;
  return first * second * third;
};

console.log('part1', part1());
console.log('part2', part2());
