import { readInput, splitAndMapInputLines } from '../utils/functions.js';

const inp = readInput();

let input = splitAndMapInputLines(inp, ', ');
input = input.map((l) => [
  ...l[0].split('='),
  ...l[1].substring(2).split('..'),
]);
input = input.map(([c, ...vals]) => [c, ...vals.map((x) => parseInt(x, 10))]);

let minX = Number.MAX_SAFE_INTEGER;
let minY = Number.MAX_SAFE_INTEGER;
let maxX = Number.MIN_SAFE_INTEGER;
let maxY = Number.MIN_SAFE_INTEGER;

input.forEach((i) => {
  if (i[0] === 'x') {
    minX = Math.min(minX, i[1]);
    maxX = Math.max(maxX, i[1]);
    minY = Math.min(minY, i[2]);
    maxY = Math.max(maxY, i[3]);
  } else if (i[0] === 'y') {
    minX = Math.min(minX, i[2]);
    maxX = Math.max(maxX, i[3]);
    minY = Math.min(minY, i[1]);
    maxY = Math.max(maxY, i[1]);
  }
});

const center = 500;
const height = maxY + 1;
let width = Math.max(maxX - 500, 500 - minX) * 2 + 2;
if (width % 2 === 0) width++;
const diff = (width - 1) / 2 - center;
const plan = [];
for (let row = 0; row < height; row++) {
  plan[row] = [];
  for (let col = 0; col < width; col++) {
    plan[row].push('.');
  }
}

input.forEach((i) => {
  if (i[0] === 'x') {
    for (let j = i[2]; j <= i[3]; j++) {
      plan[j][i[1] + diff] = '#';
    }
  } else if (i[0] === 'y') {
    for (let j = i[2]; j <= i[3]; j++) {
      plan[i[1]][j + diff] = '#';
    }
  }
});

const drop = (row, limit, direction, left, right) => {
  plan[row][limit] = '|';
  // eslint-disable-next-line no-use-before-define
  flow([row + 1, limit]);
  if (plan[row + 1][limit] === '~' && plan[row][limit + direction] === '.') {
    // eslint-disable-next-line no-use-before-define
    const spread = spreadWater(row, limit + direction);
    return [left || spread.leftWall, right || spread.rightWall];
  }
  return [left, right];
};

const spreadWater = (row, col) => {
  let leftLimit;
  let rightLimit;
  let leftWall = false;
  let rightWall = false;

  for (leftLimit = col - 1; leftLimit >= 0; leftLimit--) {
    if (plan[row][leftLimit] === '#') {
      leftWall = true;
      break;
    }
    if (plan[row + 1][leftLimit] === '.') {
      [leftWall, rightWall] = drop(row, leftLimit, -1, leftWall, rightWall);
      break;
    }
  }

  for (rightLimit = col + 1; rightLimit < plan[0].length; rightLimit++) {
    if (plan[row][rightLimit] === '#') {
      rightWall = true;
      break;
    }
    if (plan[row + 1][rightLimit] === '.') {
      [leftWall, rightWall] = drop(row, rightLimit, 1, leftWall, rightWall);
      break;
    }
  }

  for (let i = leftLimit + 1; i < rightLimit; i++) {
    plan[row][i] = leftWall && rightWall ? '~' : '|';
  }

  return {
    leftLimit,
    rightLimit,
    leftWall,
    rightWall,
  };
};

const flow = ([row, col]) => {
  if (row < plan.length - 1) {
    if (plan[row + 1][col] === '.') {
      plan[row][col] = '|';
      flow([row + 1, col]);
    } else if (plan[row + 1][col] === '#') {
      spreadWater(row, col);
    } else if (plan[row + 1][col] === '|') {
      plan[row][col] = '|';
    }

    if (plan[row + 1][col] === '~') {
      spreadWater(row, col);
    }
  } else {
    plan[row][col] = '|';
  }
};

flow([0, center + diff]);

let perm = 0;
let temp = 0;
for (let i = minY; i <= maxY; i++) {
  for (let j = 0; j < plan[i].length; j++) {
    if (plan[i][j] === '|') {
      temp++;
    } else if (plan[i][j] === '~') {
      perm++;
    }
  }
}

console.log('part1:', temp + perm);
console.log('part2:', perm);
