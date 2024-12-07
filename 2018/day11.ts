import readInput from '../utils/readInput.ts';

const input = readInput();
const serial = parseInt(input, 10);

const getRackId = (x: number): number => x + 10;

const getPower = (x: number, y: number): number => {
  let power = getRackId(x);
  power *= y;
  power += serial;
  power *= getRackId(x);
  power = Math.floor(power / 100) % 10;
  power -= 5;
  return power;
};

const grid: number[][] = [];
for (let i = 0; i < 300; i++) {
  grid[i] = [];
  for (let j = 0; j < 300; j++) {
    grid[i][j] = getPower(j + 1, i + 1);
  }
}

function getScore(x: number, y: number, size: number): number {
  let score = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      score += grid[y + i][x + j];
    }
  }

  return score;
}

const getBestScore = (size = 3): [string, number] => {
  let bestScore = Number.MIN_SAFE_INTEGER;
  let bestX = -1;
  let bestY = -1;

  for (let i = 0; i < 300 - (size - 1); i++) {
    for (let j = 0; j < 300 - (size - 1); j++) {
      const score = getScore(j, i, size);

      if (score > bestScore) {
        bestScore = score;
        bestX = j + 1;
        bestY = i + 1;
      }
    }
  }
  return [`${bestX},${bestY}`, bestScore];
};

const getBestSize = (): string => {
  let bestSize = -1;
  let bestCoords: string = '';
  let bestScore = Number.MIN_SAFE_INTEGER;
  for (let i = 1; i <= 300; i++) {
    const [coords, score] = getBestScore(i);
    if (score > bestScore) {
      bestCoords = coords;
      bestScore = score;
      bestSize = i;
    }
    if (score < 0) {
      return `${bestCoords},${bestSize}`;
    }
  }
  throw new Error('Something went wrong');
};

export const part1 = () => getBestScore()[0];

export const part2 = () => getBestSize();
