import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();
const instructions: [string, number][] = splitAndMapInputLines(input).map(
  ([i, v]) => [i, parseInt(v, 10)],
);

let visited;
let acc: number;
let ptr: number;

const switchJmpAndNop = (index: number) => {
  if (instructions[index][0] === 'jmp') {
    instructions[index][0] = 'nop';
  } else {
    instructions[index][0] = 'jmp';
  }
};

const processor = {
  acc: (value: number) => {
    acc += value;
    ptr++;
  },
  jmp: (value: number) => {
    ptr += value;
  },
  nop: () => ptr++,
};

const runProgram = () => {
  visited = [];
  acc = 0;
  ptr = 0;
  while (ptr < instructions.length) {
    if (visited[ptr] === true) return false;

    visited[ptr] = true;
    const [instruction, value] = instructions[ptr];
    processor[instruction as keyof typeof processor](value);
  }
  return true;
};

export const part1 = () => {
  runProgram();

  return acc;
};

export const part2 = () => {
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i][0] === 'acc') continue;
    switchJmpAndNop(i);

    if (runProgram()) {
      return acc;
    }

    switchJmpAndNop(i);
  }
};
