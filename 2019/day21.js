import { readInput, strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

const toAsciiArray = (str) => str.split('').map((char) => char.charCodeAt(0));

const springBot = (instructions) => {
  const ascii = toAsciiArray([...instructions, ''].join('\n'));
  const computer = intComputer(input, ascii);
  let output;
  for (output of computer);
  return output;
};

const day21part1 = () =>
  springBot(['NOT C J', 'AND D J', 'NOT A T', 'OR T J', 'WALK']);

const day21part2 = () =>
  springBot([
    'NOT A J',
    'NOT B T',
    'OR T J',
    'NOT C T',
    'OR T J',
    'AND D J',
    'NOT E T',
    'NOT T T',
    'OR H T',
    'AND T J',
    'RUN',
  ]);

console.log('part1:', day21part1());
console.log('part2:', day21part2());
