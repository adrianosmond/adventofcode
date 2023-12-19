import { readInput, strToIntArray } from '../utils/functions.js';

const input = readInput();

const processMove = (str) => {
  if (str[0] === 's') {
    return ['s', parseInt(str.substring(1), 10)];
  }
  if (str[0] === 'x') {
    return ['x', ...strToIntArray(str.substring(1), '/')];
  }
  if (str[0] === 'p') {
    return ['p', ...str.substring(1).split('/')];
  }
  throw new Error('Invalid move');
};

const start = 'abcdefghijklmnop';
const instructions = input.split(',').map(processMove);
let line = start.split('');

const moves = {
  s: (i) => {
    line = line.slice(-i).concat(line.slice(0, line.length - i));
  },
  x: (i, j) => {
    const tmp = line[i];
    line[i] = line[j];
    line[j] = tmp;
  },
  p: (i, j) => {
    const p1 = line.indexOf(i);
    const p2 = line.indexOf(j);
    line[p1] = j;
    line[p2] = i;
  },
};

const states = [start];
while (true) {
  instructions.forEach((inp) => {
    const [move, ...values] = inp;
    moves[move](...values);
  });
  const state = line.join('');
  if (states.length === 1) {
    console.log('part1:', state);
  }
  if (state === start) {
    console.log('part2:', states[1000000000 % states.length]);
    break;
  }
  states.push(state);
}
