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

export const manhattan = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number] = [0, 0],
) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

export const manhattan3d = (
  [x1, y1, z1]: [number, number, number],
  [x2, y2, z2]: [number, number, number] = [0, 0, 0],
) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);

export const strToIntArray = (
  str: string,
  sep: string | RegExp = '\n',
): number[] => str.split(sep).map((number) => parseInt(number, 10));

export const permutator = <T>(inputArr: T[]) => {
  const results: T[][] = [];

  function permute(arr: T[], memo: T[] = []) {
    let cur: T[];

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

export function getNeighbours<T>(
  grid: T[][],
  rowIdx: number,
  colIdx: number,
): [number, number, T][];

export function getNeighbours<T>(
  grid: T[][],
  rowIdx: number,
  colIdx: number,
  preserveOrder: true,
): ([number, number, T] | null)[];

export function getNeighbours<T>(
  grid: T[][],
  rowIdx: number,
  colIdx: number,
  preserveOrder: boolean = false,
) {
  const neighbours: ([number, number, T] | null)[] = [];
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
}

export const getNeighboursWithDiagonals = <T>(
  grid: T[][],
  rowIdx: number,
  colIdx: number,
) => {
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

type HexChar = keyof typeof hexMap;

export const hexToBinaryStr = (bin: string) =>
  bin
    .split('')
    .map((c) => hexMap[c as HexChar])
    .join('');

export const sortAsc = (a: number, b: number) => a - b;

export const sortDesc = (a: number, b: number) => b - a;

export function* iterateOverGrid<T>(
  grid: T[][],
): Generator<[T, number, number]> {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell: T = grid[row][col];
      yield [cell, row, col];
    }
  }
}

export const splitAndMapInputLines = <T = string>(
  input: string,
  sep: string | RegExp = ' ',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fn = (x: string, i: number): T => x as T,
) => input.split('\n').map((line) => line.split(sep).map(fn));

export const multilineStrToIntArrays = (
  str: string,
  sep: string | RegExp = ' ',
): number[][] =>
  splitAndMapInputLines(str, sep, (number) => parseInt(number, 10));

export const inputToCharGrid = (str: string): string[][] =>
  splitAndMapInputLines(str, '');

export const inputToIntGrid = (str: string): number[][] =>
  splitAndMapInputLines(str, '', (c) => parseInt(c, 10));

export const gridToCells = <T>(grid: T[][]) => {
  const result = [];
  for (const cell of iterateOverGrid(grid)) {
    result.push(cell);
  }
  return result;
};

export const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));

const lcmPair = (a: number, b: number) => (a * b) / gcd(a, b);

export const lcm = (numbers: number[]) =>
  numbers.reduce((a, b) => lcmPair(a, b));
