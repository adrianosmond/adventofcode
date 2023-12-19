import { readInput, splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();
const instructions = splitAndMapInputLines(input).map(([i, v]) => [
  i,
  parseInt(v, 10),
]);

let visited;
let acc;
let ptr;

const switchJmpAndNop = (index) => {
  if (instructions[index][0] === 'jmp') {
    instructions[index][0] = 'nop';
  } else {
    instructions[index][0] = 'jmp';
  }
};

const processor = {
  acc: (value) => {
    acc += value;
    ptr++;
  },
  jmp: (value) => {
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
    processor[instruction](value);
  }
  return true;
};

const part1 = () => {
  runProgram();

  return acc;
};

const part2 = () => {
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i][0] === 'acc') continue;
    switchJmpAndNop(i);

    if (runProgram()) {
      return acc;
    }

    switchJmpAndNop(i);
  }
};

console.log('part1', part1());
console.log('part2', part2());
