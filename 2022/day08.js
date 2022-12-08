import { readInput } from '../utils/functions.js';
import { product } from '../utils/reducers.js';

const input = readInput();

const DIRECTIONS = {
  UP: [-1, 0],
  DOWN: [1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1],
};

const trees = input
  .split('\n')
  .map((r) => r.split('').map((t) => parseInt(t, 10)));

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

const findVisible = () => {
  let visibleTrees = 0;
  for (let row = 0; row < trees.length; row++) {
    for (let col = 0; col < trees[row].length; col++) {
      const isVisible = Object.values(DIRECTIONS).some((direction) =>
        getTreesToEdge(row, col, direction).every((h) => h < trees[row][col]),
      );
      if (isVisible) {
        visibleTrees++;
      }
    }
  }
  return visibleTrees;
};

const getScenicScore = () => {
  let max = 0;
  for (let row = 1; row < trees.length - 1; row++) {
    for (let col = 1; col < trees[row].length - 1; col++) {
      const score = Object.values(DIRECTIONS)
        .map((direction) => getTreesToEdge(row, col, direction, true).length)
        .reduce(product);
      max = Math.max(score, max);
    }
  }
  return max;
};

const part1 = () => findVisible();

const part2 = () => getScenicScore();

console.log('part1', part1());
console.log('part2', part2());
