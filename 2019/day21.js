import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
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

export const part1 = () =>
  springBot(['NOT C J', 'AND D J', 'NOT A T', 'OR T J', 'WALK']);

export const part2 = () =>
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
