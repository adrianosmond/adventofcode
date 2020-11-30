const input = require('./input22');

const size = 999;

const left = {
  up: 'left',
  left: 'down',
  down: 'right',
  right: 'up',
};

const right = {
  up: 'right',
  left: 'up',
  down: 'left',
  right: 'down',
};

const reverse = {
  up: 'down',
  left: 'right',
  down: 'up',
  right: 'left',
};

const makeGrid = () => {
  let grid = input.split('\n');
  const extra = (size - grid.length) / 2;

  grid = grid.map((r) => {
    const buffer = Array(extra).fill('.');
    return [...buffer, ...r, ...buffer];
  });
  for (let i = 0; i < extra; i++) {
    grid.unshift(Array(size).fill('.'));
    grid.push(Array(size).fill('.'));
  }
  return grid;
};

function day22part1() {
  const grid = makeGrid();
  let row = (size - 1) / 2;
  let col = row;
  let direction = 'up';
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
}

function day22part2() {
  const grid = makeGrid();
  let row = (size - 1) / 2;
  let col = row;
  let direction = 'up';
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
}

console.log('part1:', day22part1());
console.log('part2:', day22part2());
