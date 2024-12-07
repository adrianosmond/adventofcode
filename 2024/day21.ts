import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';
import { getNeighbours } from '../utils/functions.ts';

const input = readInput();
const codes = input.split('\n');

type Keypad = (string | undefined)[][];
const numericKeypad: Keypad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [undefined, '0', 'A'],
];

const directionalKeypad: Keypad = [
  [undefined, '^', 'A'],
  ['<', 'v', '>'],
];

const precalculateMoves = (keypad: Keypad) => {
  const buttons = keypad.flat().filter((b) => typeof b !== 'undefined');
  const moves: Record<string, Record<string, string[]>> = {};
  for (const button of buttons) {
    moves[button] = {};

    const row = Math.floor(keypad.flat().indexOf(button) / 3);
    const col = keypad.flat().indexOf(button) % 3;
    const queue: [number, number, string, string][] = [[row, col, button, '']];

    while (queue.length > 0) {
      const [r, c, v, sequence] = queue.shift()!;
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

const cartesianProduct = <T>(...arr: T[][]): T[][] =>
  arr.reduce<T[][]>(
    (a, b) =>
      a.flatMap((accItem) => b.map((currItem) => [...accItem, currItem])),
    [[]],
  );

function* getSequencePairs(sequence: string) {
  let from = 'A';
  for (let i = 0; i < sequence.length; i++) {
    const to = sequence[i];
    yield [from, to];
    from = to;
  }
}

const findNumericKeypadOptions = (sequence: string) =>
  cartesianProduct(
    ...Array.from(getSequencePairs(sequence)).map(
      ([from, to]) => numericMoves[from][to],
    ),
  ).map((seq) => seq.join(''));

const cache: Record<string, number> = {};
const expandSequence = (sequence: string, numRobots: number) => {
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

const findBestSequenceLength = (sequence: string, numRobots: number) =>
  findNumericKeypadOptions(sequence)
    .map((seq) => expandSequence(seq, numRobots))
    .reduce((a, b) => Math.min(a, b));

const findComplexity = (code: string, numRobots: number) =>
  parseInt(code, 10) * findBestSequenceLength(code, numRobots);

export const part1 = () =>
  codes.map((code) => findComplexity(code, 2)).reduce(sum);

export const part2 = () =>
  codes.map((code) => findComplexity(code, 25)).reduce(sum);
