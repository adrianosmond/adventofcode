import { readInput, inputToCharGrid } from '../utils/functions.js';

const input = readInput();

const size = input.split('\n').length;
const centre = Math.floor(size / 2);

const getBiodiversity = (state) =>
  state
    .map((r) => r.join(''))
    .join('')
    .split('')
    .reduce((count, cell, idx) => (cell === '#' ? count + 2 ** idx : count), 0);

const getCount = (state, row, col) => {
  let count = 0;
  if (row > 0 && state[row - 1][col] === '#') {
    count++;
  }
  if (row < size - 1 && state[row + 1][col] === '#') {
    count++;
  }
  if (col > 0 && state[row][col - 1] === '#') {
    count++;
  }
  if (col < size - 1 && state[row][col + 1] === '#') {
    count++;
  }
  return count;
};

const getKey = (state) => state.map((r) => r.join('')).join('');

const nextMinute = (states, currentState) => {
  const current = states[currentState];
  const next = states[(currentState + 1) % 2];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const count = getCount(current, row, col);
      if (current[row][col] === '#' && count !== 1) {
        next[row][col] = '.';
      } else if (current[row][col] === '.' && (count === 1 || count === 2)) {
        next[row][col] = '#';
      } else {
        next[row][col] = current[row][col];
      }
    }
  }
  return getKey(next);
};

const day24part1 = () => {
  const states = [inputToCharGrid(input), inputToCharGrid(input)];
  let currentState = 0;
  const seen = { [getKey(states[0])]: true };

  while (true) {
    const key = nextMinute(states, currentState);
    currentState = (currentState + 1) % 2;
    if (seen[key]) {
      break;
    }
    seen[key] = true;
  }

  return getBiodiversity(states[currentState]);
};

const makeLevels = (numLevels) =>
  new Array(numLevels)
    .fill()
    .map(() => new Array(size).fill().map(() => new Array(size).fill('.')));

// One of the ugliest functions I've ever written!
const getRecursiveCount = (state, level, row, col) => {
  const adjacent = [];
  if (row === 0 || row === 2 || row === 3 || (row === 1 && col !== 2)) {
    adjacent.push(state[level][row + 1][col]);
  }
  if (row === 1 || row === 2 || row === 4 || (row === 3 && col !== 2)) {
    adjacent.push(state[level][row - 1][col]);
  }
  if (row === 1 && col === 2) {
    // top 5 from level - 1
    for (let i = 0; i < 5; i++) {
      adjacent.push(state[level - 1][0][i]);
    }
  }
  if (row === 3 && col === 2) {
    // bottom 5 from level - 1
    for (let i = 0; i < 5; i++) {
      adjacent.push(state[level - 1][4][i]);
    }
  }
  if (row === 0) {
    // neighbour from level + 1
    adjacent.push(state[level + 1][1][2]);
  }
  if (row === 4) {
    // neighbour from level + 1
    adjacent.push(state[level + 1][3][2]);
  }

  if (col === 0 || col === 2 || col === 3 || (col === 1 && row !== 2)) {
    adjacent.push(state[level][row][col + 1]);
  }
  if (col === 1 || col === 2 || col === 4 || (col === 3 && row !== 2)) {
    adjacent.push(state[level][row][col - 1]);
  }
  if (row === 2 && col === 1) {
    // left 5 from level - 1
    for (let i = 0; i < 5; i++) {
      adjacent.push(state[level - 1][i][0]);
    }
  }
  if (row === 2 && col === 3) {
    // right 5 from level - 1
    for (let i = 0; i < 5; i++) {
      adjacent.push(state[level - 1][i][4]);
    }
  }
  if (col === 0) {
    // neighbour from level + 1
    adjacent.push(state[level + 1][2][1]);
  }
  if (col === 4) {
    // neighbour from level + 1
    adjacent.push(state[level + 1][2][3]);
  }
  return adjacent.reduce(
    (total, current) => total + (current === '#' ? 1 : 0),
    0,
  );
};

const nextRecursiveMinute = (states, currentState, level, direction) => {
  const current = states[currentState];
  const next = states[(currentState + 1) % 2];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (row === centre && col === centre) continue;
      const count = getRecursiveCount(current, level, row, col);
      const isBug = current[level][row][col] === '#';
      if (isBug && count !== 1) {
        next[level][row][col] = '.';
      } else if (!isBug && (count === 1 || count === 2)) {
        next[level][row][col] = '#';
      } else {
        next[level][row][col] = current[level][row][col];
      }
    }
  }

  if (direction <= 0 && level > 1) {
    nextRecursiveMinute(states, currentState, level - 1, -1);
  }
  if (direction >= 0 && level < current.length - 2) {
    nextRecursiveMinute(states, currentState, level + 1, 1);
  }
};

const getNumBugs = (state) => {
  let count = 0;
  for (let level = 0; level < state.length; level++) {
    const l = state[level];
    for (let row = 0; row < l.length; row++) {
      const r = l[row];
      for (let col = 0; col < r.length; col++) {
        const cell = r[col];
        if (cell === '#') {
          count++;
        }
      }
    }
  }
  return count;
};

const day24part2 = () => {
  const numLevels = 203;
  const startLevel = Math.floor(numLevels / 2);
  const states = [makeLevels(numLevels), makeLevels(numLevels)];
  let currentState = 0;
  states[currentState][startLevel] = inputToCharGrid(input);

  for (let i = 0; i < 200; i++) {
    nextRecursiveMinute(states, currentState, startLevel, 0);
    currentState = (currentState + 1) % 2;
  }

  return getNumBugs(states[currentState]);
};

console.log('part1:', day24part1());
console.log('part2:', day24part2());
