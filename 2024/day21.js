import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';
import { getNeighbours } from '../utils/functions.js';

const input = readInput();
const codes = input.split('\n');

const numericKeypad = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
  [undefined, 0, 'A'],
];

const directionalKeypad = [
  [undefined, '^', 'A'],
  ['<', 'v', '>'],
];

const precalculateMoves = (keypad) => {
  const buttons = keypad.flat().filter((b) => typeof b !== 'undefined');
  const moves = {};
  for (const button of buttons) {
    moves[button] = {};

    const row = Math.floor(keypad.flat().indexOf(button) / 3);
    const col = keypad.flat().indexOf(button) % 3;
    const queue = [[row, col, button, '']];

    while (queue.length > 0) {
      const [r, c, v, sequence] = queue.shift();
      if (!moves[button][v]) moves[button][v] = [];
      moves[button][v].push(`${sequence}A`);
      getNeighbours(keypad, r, c).forEach(([rn, cn, cell]) => {
        if (typeof cell === 'undefined') return;
        if (
          !moves[button][cell] ||
          moves[button][cell].length === 0 ||
          sequence.length + 2 === moves[button][cell][0].length
        ) {
          let next = '';
          if (rn > r) next += 'v';
          if (rn < r) next += '^';
          if (cn < c) next += '<';
          if (cn > c) next += '>';
          queue.push([rn, cn, cell, `${sequence}${next}`]);
        }
      });
    }
  }
  return moves;
};

const numericMoves = precalculateMoves(numericKeypad);
const directionalMoves = precalculateMoves(directionalKeypad);

const cartesian = (...arr) =>
  arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

function* getSequencePairs(sequence) {
  let from = 'A';
  for (let i = 0; i < sequence.length; i++) {
    const to = sequence[i];
    yield [from, to];
    from = to;
  }
}

const findNumericKeypadOptions = (sequence) =>
  cartesian(
    ...Array.from(getSequencePairs(sequence)).map(
      ([from, to]) => numericMoves[from][to],
    ),
  ).map((seq) => seq.join(''));

const cache = {};
const expandSequence = (sequence, numRobots) => {
  if (cache[`${sequence}:${numRobots}`])
    return cache[`${sequence}:${numRobots}`];

  let length = 0;
  for (const [from, to] of getSequencePairs(sequence)) {
    length +=
      numRobots === 1
        ? directionalMoves[from][to][0].length
        : Math.min(
            ...directionalMoves[from][to].map((seq) =>
              expandSequence(seq, numRobots - 1),
            ),
          );
  }

  cache[`${sequence}:${numRobots}`] = length;
  return length;
};

const findBestSequenceLength = (sequence, numRobots) =>
  findNumericKeypadOptions(sequence)
    .map((seq) => expandSequence(seq, numRobots))
    .reduce((a, b) => Math.min(a, b));

const findComplexity = (code, numRobots) =>
  parseInt(code, 10) * findBestSequenceLength(code, numRobots);

export const part1 = () =>
  codes.map((code) => findComplexity(code, 2)).reduce(sum);

export const part2 = () =>
  codes.map((code) => findComplexity(code, 25)).reduce(sum);
