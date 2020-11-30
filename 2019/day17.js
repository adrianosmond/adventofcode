const input = require('./input17');
const { intComputer } = require('./intComputer');

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

const isValueScaffold = (s) => s === '#';

const isScaffold = (grid, x, y) => isValueScaffold(grid[y][x]);

const getAdjacent = (grid, x, y) => [
  grid[y - 1][x],
  grid[y + 1][x],
  grid[y][x - 1],
  grid[y][x + 1],
];

const getAlignmentSum = (grid) => {
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

const findRobot = (grid) => {
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

const isInGrid = (grid, x, y) =>
  x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;

const checkTurnPossible = (grid, x, y, direction) => {
  const mv = MOVEMENTS[direction];
  return (
    isInGrid(grid, x + mv[1], y + mv[0]) &&
    isScaffold(grid, x + mv[1], y + mv[0])
  );
};

const getNextTurn = (grid, x, y, direction) => {
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

const canContinue = (grid, nextX, nextY) =>
  isInGrid(grid, nextX, nextY) && isScaffold(grid, nextX, nextY);

const getInstructions = (startDirection, startX, startY, grid) => {
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

const testPattern = (fns, path) => {
  const pattern = [];
  let matchProgress = 0;

  const checkMatch = (fn, sequence) =>
    path.substr(matchProgress, sequence.length) === sequence ? fn : undefined;

  while (matchProgress < path.length) {
    if (2 * pattern.length - 1 > 20) {
      return null;
    }

    const match = Object.entries(fns).reduce(
      (m, [fn, sequence]) => m || checkMatch(fn, sequence),
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

function* makePatterns(instructions) {
  let iArr = instructions.split(',');
  iArr = iArr
    .map((i, idx) => (idx % 2 === 1 ? `${iArr[idx - 1]},${i}` : undefined))
    .filter(Boolean);

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

const findPattern = (instructions) => {
  for (const [A, B, C] of makePatterns(instructions)) {
    const pattern = testPattern({ A, B, C }, instructions);

    if (pattern) {
      return [pattern.join(','), A, B, C];
    }
  }
  throw new Error('No pattern found');
};

const toAsciiArray = (str) => str.split('').map((char) => char.charCodeAt(0));

const getDust = (grid) => {
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

console.log('part1:', getAlignmentSum(grid));
console.log('part2:', getDust(grid));
