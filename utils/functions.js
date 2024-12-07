const hexMap = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

export const manhattan = ([x1, y1], [x2, y2] = [0, 0]) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

export const manhattan3d = ([x1, y1, z1], [x2, y2, z2] = [0, 0, 0]) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);

export const strToIntArray = (str, sep = '\n') =>
  str.split(sep).map((number) => parseInt(number, 10));

export const permutator = (inputArr) => {
  const results = [];

  function permute(arr, memo = []) {
    let cur;

    for (let i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
};

/**
 * @template T
 * @param {T[][]} grid
 * @param {number} rowIdx
 * @param {number} colIdx
 * @param {boolean} [preserveOrder=false]
 * @returns {([number, number, T] | null)[]}
 */
export const getNeighbours = (grid, rowIdx, colIdx, preserveOrder = false) => {
  const neighbours = [];
  if (rowIdx < grid.length - 1)
    neighbours.push([rowIdx + 1, colIdx, grid[rowIdx + 1][colIdx]]);
  else if (preserveOrder) neighbours.push(null);
  if (rowIdx > 0)
    neighbours.push([rowIdx - 1, colIdx, grid[rowIdx - 1][colIdx]]);
  else if (preserveOrder) neighbours.push(null);
  if (colIdx < grid[0].length - 1)
    neighbours.push([rowIdx, colIdx + 1, grid[rowIdx][colIdx + 1]]);
  else if (preserveOrder) neighbours.push(null);
  if (colIdx > 0)
    neighbours.push([rowIdx, colIdx - 1, grid[rowIdx][colIdx - 1]]);
  else if (preserveOrder) neighbours.push(null);
  return neighbours;
};

/**
 * @template T
 * @param {T[][]} grid
 * @param {number} rowIdx
 * @param {number} colIdx
 * @returns {[number, number, T][]}
 */
export const getNeighboursWithDiagonals = (grid, rowIdx, colIdx) => {
  const neighbours = getNeighbours(grid, rowIdx, colIdx);
  if (rowIdx < grid.length - 1) {
    if (colIdx < grid[0].length - 1) {
      neighbours.push([rowIdx + 1, colIdx + 1, grid[rowIdx + 1][colIdx + 1]]);
    }
    if (colIdx > 0) {
      neighbours.push([rowIdx + 1, colIdx - 1, grid[rowIdx + 1][colIdx - 1]]);
    }
  }
  if (rowIdx > 0) {
    if (colIdx < grid[0].length - 1) {
      neighbours.push([rowIdx - 1, colIdx + 1, grid[rowIdx - 1][colIdx + 1]]);
    }
    if (colIdx > 0) {
      neighbours.push([rowIdx - 1, colIdx - 1, grid[rowIdx - 1][colIdx - 1]]);
    }
  }
  return neighbours;
};

export const hexToBinaryStr = (bin) =>
  bin
    .split('')
    .map((c) => hexMap[c])
    .join('');

export const sortAsc = (a, b) => a - b;

export const sortDesc = (a, b) => b - a;

/**
 * @generator
 * @template T
 * @param {T[][]} grid
 * @yields {[T, number, number]}
 */
export function* iterateOverGrid(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      yield [cell, row, col];
    }
  }
}

/**
 * @param {string} str
 * @param {string} sep
 * @param {function} fn
 * @returns {unknown[][]}
 */
export const splitAndMapInputLines = (input, sep = ' ', fn = (x) => x) =>
  input.split('\n').map((line) => line.split(sep).map(fn));

/**
 * @param {string} str
 * @param {string} sep
 * @returns {number[][]}
 */
export const multilineStrToIntArrays = (str, sep = ' ') =>
  splitAndMapInputLines(str, sep, (number) => parseInt(number, 10));

/**
 * @param {string} str
 * @returns {string[][]}
 */
export const inputToCharGrid = (str) => splitAndMapInputLines(str, '');

/**
 * @param {string} str
 * @returns {number[][]}
 */
export const inputToIntGrid = (str) =>
  splitAndMapInputLines(str, '', (c) => parseInt(c, 10));

/**
 * @template T
 * @param {T[][]} str
 * @returns {[T, number. number][]}
 */
export const gridToCells = (grid) => {
  const result = [];
  for (const cell of iterateOverGrid(grid)) {
    result.push(cell);
  }
  return result;
};

const gcd = (a, b) => (!b ? a : gcd(b, a % b));

const lcmPair = (a, b) => (a * b) / gcd(a, b);

/**
 * @param {number[]} numbers
 * @returns {number}
 */
export const lcm = (numbers) => numbers.reduce((a, b) => lcmPair(a, b));
