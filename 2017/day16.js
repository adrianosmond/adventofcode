import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

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

const dance = (part2 = false) => {
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
    if (!part2 && states.length === 1) {
      return state;
    }
    if (state === start) {
      return states[1000000000 % states.length];
    }
    states.push(state);
  }
};

export const part1 = () => dance();

export const part2 = () => dance(true);
