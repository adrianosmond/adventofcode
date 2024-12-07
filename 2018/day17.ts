import readInput from '../utils/readInput.ts';

const inp = readInput();

type ClayVein = {
  axis: 'x' | 'y';
  fixed: number;
  rangeStart: number;
  rangeEnd: number;
};

const parseLine = (line: string): ClayVein => {
  const [part1, part2] = line.split(', ');
  const [axis, fixedStr] = part1.split('=');
  if (axis !== 'x' && axis !== 'y') throw new Error(`Invalid axis: ${axis}`);
  const [rangeStartStr, rangeEndStr] = part2.substring(2).split('..');
  return {
    axis,
    fixed: parseInt(fixedStr, 10),
    rangeStart: parseInt(rangeStartStr, 10),
    rangeEnd: parseInt(rangeEndStr, 10),
  };
};

const input = inp.split('\n').map(parseLine);

let minX = Number.MAX_SAFE_INTEGER;
let minY = Number.MAX_SAFE_INTEGER;
let maxX = Number.MIN_SAFE_INTEGER;
let maxY = Number.MIN_SAFE_INTEGER;

input.forEach((i) => {
  if (i.axis === 'x') {
    minX = Math.min(minX, i.fixed);
    maxX = Math.max(maxX, i.fixed);
    minY = Math.min(minY, i.rangeStart);
    maxY = Math.max(maxY, i.rangeEnd);
  } else if (i.axis === 'y') {
    minX = Math.min(minX, i.rangeStart);
    maxX = Math.max(maxX, i.rangeEnd);
    minY = Math.min(minY, i.fixed);
    maxY = Math.max(maxY, i.fixed);
  }
});

const center = 500;
const height = maxY + 1;
let width = Math.max(maxX - 500, 500 - minX) * 2 + 2;
if (width % 2 === 0) width++;
const diff = (width - 1) / 2 - center;
const plan: string[][] = [];
for (let row = 0; row < height; row++) {
  plan[row] = [];
  for (let col = 0; col < width; col++) {
    plan[row].push('.');
  }
}

input.forEach((i) => {
  if (i.axis === 'x') {
    for (let j = i.rangeStart; j <= i.rangeEnd; j++) {
      plan[j][i.fixed + diff] = '#';
    }
  } else if (i.axis === 'y') {
    for (let j = i.rangeStart; j <= i.rangeEnd; j++) {
      plan[i.fixed][j + diff] = '#';
    }
  }
});

const drop = (
  row: number,
  limit: number,
  direction: number,
  left: boolean,
  right: boolean,
): [boolean, boolean] => {
  plan[row][limit] = '|';
  flow([row + 1, limit]);
  if (plan[row + 1][limit] === '~' && plan[row][limit + direction] === '.') {
    const spread = spreadWater(row, limit + direction);
    return [left || spread.leftWall, right || spread.rightWall];
  }
  return [left, right];
};

const spreadWater = (
  row: number,
  col: number,
): {
  leftLimit: number;
  rightLimit: number;
  leftWall: boolean;
  rightWall: boolean;
} => {
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

const flow = ([row, col]: [number, number]): void => {
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

export const part1 = () => temp + perm;

export const part2 = () => perm;
