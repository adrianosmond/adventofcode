import readInput from '../utils/readInput.js';

const input = readInput();

const directions = [
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

const getElves = () => {
  const elves = [];
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

const getNeigbouringPositions = ({ row, col }) => [
  `${row - 1},${col - 1}`,
  `${row - 1},${col}`,
  `${row - 1},${col + 1}`,
  `${row},${col - 1}`,
  `${row},${col + 1}`,
  `${row + 1},${col - 1}`,
  `${row + 1},${col}`,
  `${row + 1},${col + 1}`,
];

const getNeigbouringPositionsByDirection = (elf, direction) =>
  direction.map(([r, c]) => `${elf.row + r},${elf.col + c}`);

const getPositions = (elves) =>
  Object.fromEntries(elves.map((e) => [`${e.row},${e.col}`, true]));

const doRound = (elves, round) => {
  let moved = false;
  const positions = getPositions(elves);
  const proposals = {};
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
    elf.destination = undefined;
    elf.destinationRow = undefined;
    elf.destinationCol = undefined;
  }
  return moved;
};

const getBounds = (elves) => {
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
