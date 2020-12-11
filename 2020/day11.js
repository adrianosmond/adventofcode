const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input11.txt'), 'utf8');

const layout = input.split('\n').map((r) => r.split(''));

const STATES = {
  EMPTY: 'L',
  FLOOR: '.',
  OCCUPIED: '#',
};

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const isInGridBounds = (row, col) =>
  row >= 0 && col >= 0 && row < layout.length && col <= layout[0].length;

const getAdjacent = (grid, row, col, maxDistance = 1) =>
  DIRECTIONS.map(([rDiff, cDiff]) => {
    let r = row + rDiff;
    let c = col + cDiff;
    let distance = 1;

    while (isInGridBounds(r, c) && distance <= maxDistance) {
      if (grid[r][c] !== STATES.FLOOR) {
        return grid[r][c];
      }
      r += rDiff;
      c += cDiff;
      distance++;
    }

    return false;
  }).filter(Boolean);

const getNextCellState = (
  grid,
  row,
  col,
  maxDistance = 1,
  neighbourTolerance = 4,
) => {
  const currentState = grid[row][col];
  if (currentState === STATES.FLOOR) return STATES.FLOOR;

  const numAdjacentOccupied = getAdjacent(grid, row, col, maxDistance).filter(
    (s) => s === STATES.OCCUPIED,
  ).length;

  if (currentState === STATES.EMPTY && numAdjacentOccupied === 0) {
    return STATES.OCCUPIED;
  }

  if (
    currentState === STATES.OCCUPIED &&
    numAdjacentOccupied >= neighbourTolerance
  ) {
    return STATES.EMPTY;
  }

  return currentState;
};

const getNextLayout = (prev, maxDistance = 1, neighbourTolerance = 4) => {
  const next = [];
  for (let i = 0; i < prev.length; i++) {
    const row = [];
    for (let j = 0; j < prev[i].length; j++) {
      row.push(getNextCellState(prev, i, j, maxDistance, neighbourTolerance));
    }
    next.push(row);
  }

  return next;
};

const makeStr = (l) => l.map((r) => r.join('')).join('\n');

const findStableState = (maxDistance = 1, neighbourTolerance = 4) => {
  let next = layout;
  let current = makeStr(next);
  let prev = '';

  while (current !== prev) {
    prev = current;
    next = getNextLayout(next, maxDistance, neighbourTolerance);
    current = makeStr(next);
  }

  return current.replace(/[^#]/g, '').length;
};

const part1 = () => findStableState();

const part2 = () => findStableState(Number.MAX_SAFE_INTEGER, 5);

console.log('part1', part1());
console.log('part2', part2());
