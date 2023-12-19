import { gridToCells, readInput, inputToIntGrid } from '../utils/functions.js';
import { product } from '../utils/reducers.js';

const input = readInput();

const DIRECTIONS = {
  UP: [-1, 0],
  DOWN: [1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1],
};

const trees = inputToIntGrid(input);

const getTreesToEdge = (row, col, [rowDiff, colDiff], onlyVisible = false) => {
  const treesToEdge = [];
  let r = row + rowDiff;
  let c = col + colDiff;
  const height = trees[row][col];

  while (r >= 0 && r < trees.length && c >= 0 && c < trees[0].length) {
    treesToEdge.push(trees[r][c]);
    if (onlyVisible && trees[r][c] >= height) {
      return treesToEdge;
    }
    r += rowDiff;
    c += colDiff;
  }

  return treesToEdge;
};

const findVisible = () =>
  gridToCells(trees)
    .map(([cell, row, col]) =>
      Object.values(DIRECTIONS).some((direction) =>
        getTreesToEdge(row, col, direction).every((h) => h < cell),
      ),
    )
    .filter(Boolean).length;

const getScenicScore = () =>
  Math.max(
    ...gridToCells(trees).map(([, row, col]) =>
      Object.values(DIRECTIONS)
        .map((direction) => getTreesToEdge(row, col, direction, true).length)
        .reduce(product),
    ),
  );

const part1 = () => findVisible();

const part2 = () => getScenicScore();

console.log('part1', part1());
console.log('part2', part2());
