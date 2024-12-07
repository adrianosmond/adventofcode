import readInput from '../utils/readInput.ts';

const input = readInput();

const size = 999;

type Direction = 'up' | 'down' | 'left' | 'right';

const left: Record<Direction, Direction> = {
  up: 'left',
  left: 'down',
  down: 'right',
  right: 'up',
};

const right: Record<Direction, Direction> = {
  up: 'right',
  left: 'up',
  down: 'left',
  right: 'down',
};

const reverse: Record<Direction, Direction> = {
  up: 'down',
  left: 'right',
  down: 'up',
  right: 'left',
};

const makeGrid = () => {
  const lines = input.split('\n');
  const extra = (size - lines.length) / 2;

  const grid: string[][] = lines.map((r) => {
    const buffer = Array(extra).fill('.');
    return [...buffer, ...r, ...buffer];
  });
  for (let i = 0; i < extra; i++) {
    grid.unshift(Array(size).fill('.'));
    grid.push(Array(size).fill('.'));
  }
  return grid;
};

export const part1 = () => {
  const grid = makeGrid();
  let row = (size - 1) / 2;
  let col = row;
  let direction: Direction = 'up';
  let infections = 0;

  for (let i = 0; i < 10000; i++) {
    if (grid[row][col] === '#') {
      direction = right[direction];
      grid[row][col] = '.';
    } else {
      direction = left[direction];
      grid[row][col] = '#';
      infections++;
    }
    if (direction === 'up') {
      row--;
    } else if (direction === 'down') {
      row++;
    } else if (direction === 'left') {
      col--;
    } else if (direction === 'right') {
      col++;
    }
  }
  return infections;
};

export const part2 = () => {
  const grid = makeGrid();
  let row = (size - 1) / 2;
  let col = row;
  let direction: Direction = 'up';
  let infections = 0;

  for (let i = 0; i < 10000000; i++) {
    if (grid[row][col] === '#') {
      direction = right[direction];
      grid[row][col] = 'F';
    } else if (grid[row][col] === '.') {
      direction = left[direction];
      grid[row][col] = 'W';
    } else if (grid[row][col] === 'W') {
      grid[row][col] = '#';
      infections++;
    } else if (grid[row][col] === 'F') {
      direction = reverse[direction];
      grid[row][col] = '.';
    }

    if (direction === 'up') {
      row--;
    } else if (direction === 'down') {
      row++;
    } else if (direction === 'left') {
      col--;
    } else if (direction === 'right') {
      col++;
    }
  }
  return infections;
};
