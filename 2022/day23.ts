import readInput from '../utils/readInput.ts';

const input = readInput();

type Coords = [number, number];
const directions: Coords[][] = [
  [
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ],
  [
    [1, -1],
    [1, 0],
    [1, 1],
  ],
  [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
];

type Elf = {
  id: number;
  row: number;
  col: number;
} & (
  | { destination: string; destinationRow: number; destinationCol: number }
  | { destination?: never; destinationRow?: never; destinationCol?: never }
);
const getElves = () => {
  const elves: Elf[] = [];
  input.split('\n').map((row, rowIdx) =>
    row.split('').forEach((cell, colIdx) => {
      if (cell === '#') {
        elves.push({
          id: elves.length,
          row: rowIdx,
          col: colIdx,
        });
      }
    }),
  );
  return elves;
};

const getNeigbouringPositions = ({
  row,
  col,
}: {
  row: number;
  col: number;
}) => [
  `${row - 1},${col - 1}`,
  `${row - 1},${col}`,
  `${row - 1},${col + 1}`,
  `${row},${col - 1}`,
  `${row},${col + 1}`,
  `${row + 1},${col - 1}`,
  `${row + 1},${col}`,
  `${row + 1},${col + 1}`,
];

const getNeigbouringPositionsByDirection = (elf: Elf, direction: Coords[]) =>
  direction.map(([r, c]) => `${elf.row + r},${elf.col + c}`);

const getPositions = (elves: Elf[]) =>
  Object.fromEntries(elves.map((e) => [`${e.row},${e.col}`, true]));

const doRound = (elves: Elf[], round: number) => {
  let moved = false;
  const positions = getPositions(elves);
  const proposals: Record<string, number> = {};
  for (const elf of elves) {
    if (getNeigbouringPositions(elf).every((pos) => !positions[pos])) {
      continue;
    }

    let d;
    let found = false;
    for (d = 0; d < 4; d++) {
      const dir = directions[(round + d) % 4];
      if (
        getNeigbouringPositionsByDirection(elf, dir).every(
          (pos) => !positions[pos],
        )
      ) {
        found = true;
        break;
      }
    }
    if (!found) continue;
    const direction = directions[(round + d) % 4];
    const propRow = elf.row + direction[1][0];
    const propCol = elf.col + direction[1][1];
    const prop = `${propRow},${propCol}`;

    if (typeof proposals[prop] === 'undefined') {
      proposals[prop] = elf.id;
      elf.destination = prop;
      elf.destinationRow = propRow;
      elf.destinationCol = propCol;
    } else if (proposals[prop] >= 0) {
      elves[proposals[prop]].destination = undefined;
      elves[proposals[prop]].destinationRow = undefined;
      elves[proposals[prop]].destinationCol = undefined;
      proposals[prop] = -1;
    }
  }
  for (const elf of elves) {
    if (!elf.destination) continue;
    moved = true;
    elf.row = elf.destinationRow;
    elf.col = elf.destinationCol;
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error unsetting all 3 optional props
    elf.destination = undefined;
    // @ts-expect-error
    elf.destinationRow = undefined;
    // @ts-expect-error
    elf.destinationCol = undefined;
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  }
  return moved;
};

const getBounds = (elves: Elf[]) => {
  let minRow = Number.MAX_SAFE_INTEGER;
  let minCol = Number.MAX_SAFE_INTEGER;
  let maxRow = Number.MIN_SAFE_INTEGER;
  let maxCol = Number.MIN_SAFE_INTEGER;
  elves.forEach((elf) => {
    minRow = Math.min(minRow, elf.row);
    maxRow = Math.max(maxRow, elf.row);
    minCol = Math.min(minCol, elf.col);
    maxCol = Math.max(maxCol, elf.col);
  });
  return [minRow, minCol, maxRow, maxCol];
};

export const part1 = () => {
  const elves = getElves();

  for (let round = 0; round < 10; round++) {
    doRound(elves, round);
  }

  let count = 0;
  const positions = getPositions(elves);
  const [minRow, minCol, maxRow, maxCol] = getBounds(elves);

  for (let y = minRow; y <= maxRow; y++) {
    for (let x = minCol; x <= maxCol; x++) {
      if (!positions[`${y},${x}`]) count++;
    }
  }

  return count;
};

export const part2 = () => {
  const elves = getElves();
  let round = 0;
  while (doRound(elves, round)) {
    round++;
  }
  return round + 1;
};
