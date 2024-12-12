import readInput from '../utils/readInput.js';
import {
  getNeighbours,
  gridToCells,
  inputToCharGrid,
} from '../utils/functions.js';

const input = readInput();
const grid = inputToCharGrid(input);
const regions = [];
const processed = {};

const findRegion = ([cell, row, col], region) => {
  region.cells.push([row, col]);
  region.perimeter += 4;
  getNeighbours(grid, row, col).forEach(([r, c, v]) => {
    if (v !== cell) return;
    region.perimeter -= 1;
    if (processed[`${r},${c}`]) return;
    processed[`${r},${c}`] = true;
    findRegion([v, r, c], region);
  });
  return region;
};

const findSides = (region) => {
  if (region.cells.length < 3) {
    return 4;
  }
  let sides = 0;
  const maxR = Math.max(...region.cells.map(([r]) => r));
  const maxC = Math.max(...region.cells.map(([, c]) => c));
  const minR = Math.min(...region.cells.map(([r]) => r));
  const minC = Math.min(...region.cells.map(([, c]) => c));

  for (let row = minR; row <= maxR; row++) {
    let topSide = false;
    let bottomSide = false;
    for (let col = minC; col <= maxC; col++) {
      if (
        grid[row][col] === region.plant &&
        region.cells.findIndex(([r, c]) => r === row && c === col) >= 0
      ) {
        if (row === minR) {
          if (!topSide) {
            topSide = true;
            sides++;
          }
        } else if (!topSide && grid[row - 1][col] !== region.plant) {
          topSide = true;
          sides++;
        } else if (grid[row - 1][col] === region.plant) {
          topSide = false;
        }

        if (
          !bottomSide &&
          (row === grid.length - 1 || grid[row + 1][col] !== region.plant)
        ) {
          bottomSide = true;
          sides++;
        } else if (
          row !== grid.length - 1 &&
          grid[row + 1][col] === region.plant
        ) {
          bottomSide = false;
        }
      } else {
        topSide = false;
        bottomSide = false;
      }
    }
  }

  for (let col = minC; col <= maxC; col++) {
    let leftSide = false;
    let rightSide = false;
    for (let row = minR; row <= maxR; row++) {
      if (
        grid[row][col] === region.plant &&
        region.cells.findIndex(([r, c]) => r === row && c === col) >= 0
      ) {
        if (col === minC) {
          if (!leftSide) {
            leftSide = true;
            sides++;
          }
        } else if (!leftSide && grid[row][col - 1] !== region.plant) {
          leftSide = true;
          sides++;
        } else if (grid[row][col - 1] === region.plant) {
          leftSide = false;
        }

        if (
          !rightSide &&
          (col === grid[0].length - 1 || grid[row][col + 1] !== region.plant)
        ) {
          rightSide = true;
          sides++;
        } else if (
          col !== grid[0].length - 1 &&
          grid[row][col + 1] === region.plant
        ) {
          rightSide = false;
        }
      } else {
        leftSide = false;
        rightSide = false;
      }
    }
  }

  return sides;
};

const makeRegions = () => {
  if (regions.length > 0) return regions;
  let regionIdx = 0;

  gridToCells(grid).forEach(([cell, row, col]) => {
    if (processed[`${row},${col}`]) return;
    processed[`${row},${col}`] = true;
    regions[regionIdx] = findRegion([cell, row, col], {
      plant: cell,
      perimeter: 0,
      cells: [],
    });
    regions[regionIdx].sides = findSides(regions[regionIdx]);
    regionIdx++;
  });

  return regions;
};

export const part1 = () =>
  makeRegions().reduce((total, r) => total + r.perimeter * r.cells.length, 0);

export const part2 = () =>
  makeRegions().reduce((total, r) => total + r.sides * r.cells.length, 0);
