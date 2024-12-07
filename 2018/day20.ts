import readInput from '../utils/readInput.ts';

const input = readInput();
const size = 211;
const diff = (size - 1) / 2;
const grid: string[][] = new Array(size)
  .fill(0)
  .map(() => new Array(size).fill('.'));

let minRow = diff;
let maxRow = diff;
let minCol = diff;
let maxCol = diff;

function setSquare(row: number, col: number, char: string): void {
  if (char === '?' && grid[row + diff][col + diff] !== '.') {
    return;
  }
  grid[row + diff][col + diff] = char;
  if (char === '#') {
    if (row + diff < minRow) minRow = row + diff;
    if (row + diff > maxRow) maxRow = row + diff;
    if (col + diff < minCol) minCol = col + diff;
    if (col + diff > maxCol) maxCol = col + diff;
  }
}

setSquare(0, 0, 'X');
setSquare(-1, -1, '#');
setSquare(-1, 1, '#');
setSquare(1, -1, '#');
setSquare(1, 1, '#');
setSquare(0, 1, '?');
setSquare(0, -1, '?');
setSquare(1, 0, '?');
setSquare(-1, 0, '?');
const stack = [[0, 0]];
let coords = [...stack[stack.length - 1]];
for (let i = 0; i < input.length; i++) {
  const char = input[i];
  if (char === 'N') {
    setSquare(coords[0] - 1, coords[1], '-');
    setSquare(coords[0] - 2, coords[1] - 1, '?');
    setSquare(coords[0] - 2, coords[1] + 1, '?');
    setSquare(coords[0] - 3, coords[1] - 1, '#');
    setSquare(coords[0] - 3, coords[1], '?');
    setSquare(coords[0] - 3, coords[1] + 1, '#');
    coords[0] -= 2;
  } else if (char === 'S') {
    setSquare(coords[0] + 1, coords[1], '-');
    setSquare(coords[0] + 2, coords[1] - 1, '?');
    setSquare(coords[0] + 2, coords[1] + 1, '?');
    setSquare(coords[0] + 3, coords[1] - 1, '#');
    setSquare(coords[0] + 3, coords[1], '?');
    setSquare(coords[0] + 3, coords[1] + 1, '#');
    coords[0] += 2;
  } else if (char === 'E') {
    setSquare(coords[0], coords[1] + 1, '|');
    setSquare(coords[0] - 1, coords[1] + 2, '?');
    setSquare(coords[0] + 1, coords[1] + 2, '?');
    setSquare(coords[0] - 1, coords[1] + 3, '#');
    setSquare(coords[0], coords[1] + 3, '?');
    setSquare(coords[0] + 1, coords[1] + 3, '#');
    coords[1] += 2;
  } else if (char === 'W') {
    setSquare(coords[0], coords[1] - 1, '|');
    setSquare(coords[0] - 1, coords[1] - 2, '?');
    setSquare(coords[0] + 1, coords[1] - 2, '?');
    setSquare(coords[0] - 1, coords[1] - 3, '#');
    setSquare(coords[0], coords[1] - 3, '?');
    setSquare(coords[0] + 1, coords[1] - 3, '#');
    coords[1] -= 2;
  } else if (char === '(') {
    stack.push([...coords]);
    coords = [...stack[stack.length - 1]];
  } else if (char === ')') {
    stack.pop();
  } else if (char === '|') {
    coords = [...stack[stack.length - 1]];
  }
}

for (let row = minRow; row <= maxRow; row++) {
  for (let col = minCol; col <= maxCol; col++) {
    if (grid[row][col] === '?') {
      grid[row][col] = '#';
    }
  }
}

let far = 0;
const farThreshold = 1000;

function findLongestPath(
  distance: number,
  from: [number, number],
  ignore?: [number, number],
): number {
  if (distance >= farThreshold) far++;
  const options: [number, number][] = [];
  if (from[0] > minRow + 1 && grid[from[0] - 1][from[1]] !== '#') {
    options.push([from[0] - 2, from[1]]);
  }
  if (from[0] < maxRow - 1 && grid[from[0] + 1][from[1]] !== '#') {
    options.push([from[0] + 2, from[1]]);
  }
  if (from[1] > minCol + 1 && grid[from[0]][from[1] - 1] !== '#') {
    options.push([from[0], from[1] - 2]);
  }
  if (from[1] < maxCol - 1 && grid[from[0]][from[1] + 1] !== '#') {
    options.push([from[0], from[1] + 2]);
  }
  const distances: number[] = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (ignore && option[0] === ignore[0] && option[1] === ignore[1]) {
      distances.push(-1);
      continue;
    }
    distances.push(findLongestPath(1 + distance, option, from));
  }
  if (distances.length === 0) return 0;
  return 1 + Math.max(...distances);
}

export const part1 = () => findLongestPath(0, [diff, diff]);

export const part2 = () => far;
