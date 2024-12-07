import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();

type MoveInstruction =
  | ['s', number]
  | ['x', number, number]
  | ['p', string, string];

const processMove = (str: string): MoveInstruction => {
  if (str[0] === 's') {
    return ['s', parseInt(str.substring(1), 10)];
  }
  if (str[0] === 'x') {
    const [i, j] = strToIntArray(str.substring(1), '/');
    return ['x', i, j];
  }
  if (str[0] === 'p') {
    const [a, b] = str.substring(1).split('/');
    return ['p', a, b];
  }
  throw new Error('Invalid move');
};

const dance = (part2 = false) => {
  const start = 'abcdefghijklmnop';
  const instructions = input.split(',').map(processMove);
  let line = start.split('');

  const moves = {
    s: (i: number) => {
      line = line.slice(-i).concat(line.slice(0, line.length - i));
    },
    x: (i: number, j: number) => {
      const tmp = line[i];
      line[i] = line[j];
      line[j] = tmp;
    },
    p: (i: string, j: string) => {
      const p1 = line.indexOf(i);
      const p2 = line.indexOf(j);
      line[p1] = j;
      line[p2] = i;
    },
  };

  const states = [start];
  while (true) {
    instructions.forEach((inp) => {
      if (inp[0] === 's') moves.s(inp[1]);
      else if (inp[0] === 'x') moves.x(inp[1], inp[2]);
      else if (inp[0] === 'p') moves.p(inp[1], inp[2]);
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
