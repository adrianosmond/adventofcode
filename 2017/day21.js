import input from './input21.js';

import { mergeObjects } from '../utils/reducers.js';

const rules = input.split('\n').map((l) => l.split(' => '));
const variants = [...rules];

const makeOutput = (inp) =>
  new Array(inp.length).fill(null).map(() => new Array(inp[0].length).fill(''));

const flipHorizontal = (inp) => {
  const output = makeOutput(inp);
  for (let i = 0; i < inp.length; i++) {
    for (let j = 0; j < inp[0].length; j++) {
      output[i][j] = inp[i][inp.length - j - 1];
    }
  }
  return output;
};

const flipVertical = (inp) => {
  const output = makeOutput(inp);
  for (let i = 0; i < inp.length; i++) {
    for (let j = 0; j < inp.length; j++) {
      output[i][j] = inp[inp.length - i - 1][j];
    }
  }
  return output;
};

const rotate90 = (inp) => {
  const output = makeOutput(inp);
  for (let i = 0; i < inp.length; i++) {
    for (let j = 0; j < inp.length; j++) {
      output[i][j] = inp[inp.length - 1 - j][i];
    }
  }
  return output;
};

const rotate270 = (inp) => {
  const output = makeOutput(inp);
  for (let i = 0; i < inp.length; i++) {
    for (let j = 0; j < inp.length; j++) {
      output[i][j] = inp[j][inp.length - 1 - i];
    }
  }
  return output;
};

const strToGrid = (str) => str.split('/').map((l) => l.split(''));

const gridToStr = (grid) => grid.map((r) => r.join('')).join('/');

const addVariant = (grid, outcome) => variants.push([gridToStr(grid), outcome]);

rules.forEach(([rule, outcome]) => {
  const grid = strToGrid(rule);
  addVariant(flipHorizontal(grid), outcome);
  addVariant(flipVertical(grid), outcome);
  addVariant(flipVertical(flipHorizontal(grid)), outcome);
  addVariant(rotate90(grid), outcome);
  addVariant(rotate270(grid), outcome);
  addVariant(rotate90(flipHorizontal(grid)), outcome);
  addVariant(rotate90(flipVertical(grid)), outcome);
});

const dictionary = variants
  .map((x) => ({ [x[0]]: x[1] }))
  .reduce(mergeObjects, {});

let pattern = '.#./..#/###';

const getGrid = (ptrn, gridSize, row, col) => {
  let grid = '';
  const size = ptrn.indexOf('/');
  for (let i = row * gridSize; i < row * gridSize + gridSize; i++) {
    if (i > row * gridSize) {
      grid += '/';
    }
    for (let j = col * gridSize; j < col * gridSize + gridSize; j++) {
      const pos = i * size + i + j;
      grid += ptrn[pos];
    }
  }
  return grid;
};

const rebuildPattern = (grids) => {
  const newSize = grids.length;
  const innerSize = grids[0].length;
  const sqrt = Math.sqrt(newSize);
  pattern = '';
  for (let k = 0; k < newSize; k += sqrt) {
    if (k > 0) pattern += '/';
    for (let i = 0; i < innerSize; i++) {
      if (i > 0) pattern += '/';
      for (let j = 0; j < sqrt; j++) {
        pattern += grids[j + k][i];
      }
    }
  }
  return pattern;
};

for (let i = 0; i < 18; i++) {
  const size = pattern.indexOf('/');
  let grids = [];
  const gridSize = size % 2 === 0 ? 2 : 3;
  const numGrids = size % 2 === 0 ? size / 2 : size / 3;

  for (let j = 0; j < numGrids; j++) {
    for (let k = 0; k < numGrids; k++) {
      grids.push(getGrid(pattern, gridSize, j, k));
    }
  }

  grids = grids.map((g) => dictionary[g]);
  grids = grids.map((g) => g.split('/'));
  pattern = rebuildPattern(grids);
  if (i === 4) {
    console.log('part1:', pattern.replace(/[^#]/g, '').length);
  } else if (i === 17) {
    console.log('part2:', pattern.replace(/[^#]/g, '').length);
  }
}
