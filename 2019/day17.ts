import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { intComputer } from './intComputer.ts';

const input = strToIntArray(readInput(), ',');

const MOVEMENTS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

const makeGrid = () => {
  const computer = intComputer(input, []);
  const grid = [];
  let row = [];

  for (const output of computer) {
    if (output === 10) {
      if (row.length > 0) {
        grid.push(row);
        row = [];
      }
    } else {
      row.push(String.fromCharCode(output));
    }
  }
  return grid;
};

const isValueScaffold = (s: string) => s === '#';

const isScaffold = (grid: string[][], x: number, y: number) =>
  isValueScaffold(grid[y][x]);

const getAdjacent = (grid: string[][], x: number, y: number) => [
  grid[y - 1][x],
  grid[y + 1][x],
  grid[y][x - 1],
  grid[y][x + 1],
];

const getAlignmentSum = (grid: string[][]) => {
  let alignmentSum = 0;
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[0].length - 1; x++) {
      if (
        isScaffold(grid, x, y) &&
        getAdjacent(grid, x, y).every(isValueScaffold)
      ) {
        alignmentSum += y * x;
      }
    }
  }
  return alignmentSum;
};

const findRobot = (grid: string[][]) => {
  for (let y = 0; y < grid.length - 0; y++) {
    for (let x = 0; x < grid[0].length - 0; x++) {
      const p = grid[y][x];
      if (p === '^') {
        return [DIRECTIONS.UP, x, y];
      }
      if (p === '>') {
        return [DIRECTIONS.RIGHT, x, y];
      }
      if (p === 'v') {
        return [DIRECTIONS.DOWN, x, y];
      }
      if (p === '<') {
        return [DIRECTIONS.LEFT, x, y];
      }
    }
  }
  throw new Error('Robot not found...');
};

const isInGrid = (grid: string[][], x: number, y: number) =>
  x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;

const checkTurnPossible = (
  grid: string[][],
  x: number,
  y: number,
  direction: number,
) => {
  const mv = MOVEMENTS[direction];
  return (
    isInGrid(grid, x + mv[1], y + mv[0]) &&
    isScaffold(grid, x + mv[1], y + mv[0])
  );
};

const getNextTurn = (
  grid: string[][],
  x: number,
  y: number,
  direction: number,
): [number, string | null] => {
  const dirLTurn = (direction + 3) % MOVEMENTS.length;
  if (checkTurnPossible(grid, x, y, dirLTurn)) {
    return [dirLTurn, ',L'];
  }

  const dirRTurn = (direction + 1) % MOVEMENTS.length;
  if (checkTurnPossible(grid, x, y, dirRTurn)) {
    return [dirRTurn, ',R'];
  }

  // Nowhere left to move
  return [-1, null];
};

const canContinue = (grid: string[][], nextX: number, nextY: number) =>
  isInGrid(grid, nextX, nextY) && isScaffold(grid, nextX, nextY);

const getInstructions = (
  startDirection: number,
  startX: number,
  startY: number,
  grid: string[][],
) => {
  let instructions = '';
  let x = startX;
  let y = startY;
  let [direction, turn] = getNextTurn(grid, x, y, startDirection);
  while (direction >= 0) {
    instructions += turn;
    let count = 0;
    const mv = MOVEMENTS[direction];
    while (canContinue(grid, x + mv[1], y + mv[0])) {
      count++;
      y += mv[0];
      x += mv[1];
    }
    instructions += `,${count}`;
    [direction, turn] = getNextTurn(grid, x, y, direction);
  }

  return instructions.substring(1);
};

type fn = 'A' | 'B' | 'C';
const testPattern = (fns: Record<fn, string>, path: string) => {
  const pattern: string[] = [];
  let matchProgress = 0;

  const checkMatch = (fn: fn, sequence: string) =>
    path.substr(matchProgress, sequence.length) === sequence ? fn : undefined;

  while (matchProgress < path.length) {
    if (2 * pattern.length - 1 > 20) {
      return null;
    }

    const match = Object.entries(fns).reduce<fn | undefined>(
      (m, [fn, sequence]) => m || checkMatch(fn as fn, sequence),
      undefined,
    );

    if (match) {
      pattern.push(match);
      matchProgress += fns[match].length + 1;
    } else {
      return null;
    }
  }

  return pattern;
};

function* makePatterns(instructions: string) {
  const ins = instructions.split(',');
  const iArr = ins
    .map((i, idx) => (idx % 2 === 1 ? `${ins[idx - 1]},${i}` : undefined))
    .filter(Boolean) as string[];

  for (let aEnd = 1; aEnd < iArr.length; aEnd++) {
    const A = iArr.slice(0, aEnd).join(',');
    if (A.length > 20) {
      continue;
    }

    for (let b = aEnd + 1; b < iArr.length; b++) {
      for (let bEnd = b + 1; bEnd < iArr.length; bEnd++) {
        const B = iArr.slice(b, bEnd).join(',');
        if (B.length > 20) {
          continue;
        }

        for (let c = bEnd + 1; c < iArr.length; c++) {
          for (let cEnd = c + 1; cEnd < iArr.length; cEnd++) {
            const C = iArr.slice(c, cEnd).join(',');
            if (C.length > 20) {
              continue;
            }

            yield [A, B, C];
          }
        }
      }
    }
  }
}

const findPattern = (instructions: string) => {
  for (const [A, B, C] of makePatterns(instructions)) {
    const pattern = testPattern({ A, B, C }, instructions);

    if (pattern) {
      return [pattern.join(','), A, B, C];
    }
  }
  throw new Error('No pattern found');
};

const toAsciiArray = (str: string) =>
  str.split('').map((char) => char.charCodeAt(0));

const getDust = (grid: string[][]) => {
  const program = [...input];
  program[0] = 2;

  const [direction, x, y] = findRobot(grid);
  const instructions = getInstructions(direction, x, y, grid);
  const inputs = toAsciiArray(
    [...findPattern(instructions), 'n', ''].join('\n'),
  );

  const computer = intComputer(program, inputs);
  let dust;
  for (dust of computer);
  return dust;
};

const grid = makeGrid();

export const part1 = () => getAlignmentSum(grid);

export const part2 = () => getDust(grid);
