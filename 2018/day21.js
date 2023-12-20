import readInput from '../utils/readInput.js';

const input = readInput();

const [p, ...inst] = input.split('\n');
const ptrReg = parseInt(p.split(' ')[1], 10);
const instructions = inst
  .map((i) => i.split(' '))
  .map(([i, ...values]) => [i, ...values.map((v) => parseInt(v, 10))]);

const max = instructions[10][2];

const opCodes = {
  addr: (reg, A, B, C) => {
    reg[C] = reg[A] + reg[B];
  },
  addi: (reg, A, B, C) => {
    reg[C] = reg[A] + B;
  },
  mulr: (reg, A, B, C) => {
    reg[C] = reg[A] * reg[B];
  },
  muli: (reg, A, B, C) => {
    reg[C] = reg[A] * B;
  },
  banr: (reg, A, B, C) => {
    reg[C] = reg[A] & reg[B];
  },
  bani: (reg, A, B, C) => {
    reg[C] = reg[A] & B;
  },
  borr: (reg, A, B, C) => {
    reg[C] = reg[A] | reg[B];
  },
  bori: (reg, A, B, C) => {
    reg[C] = reg[A] | B;
  },
  setr: (reg, A, B, C) => {
    reg[C] = reg[A];
  },
  seti: (reg, A, B, C) => {
    reg[C] = A;
  },
  gtir: (reg, A, B, C) => {
    reg[C] = A > reg[B] ? 1 : 0;
  },
  gtri: (reg, A, B, C) => {
    reg[C] = reg[A] > B ? 1 : 0;
  },
  gtrr: (reg, A, B, C) => {
    reg[C] = reg[A] > reg[B] ? 1 : 0;
  },
  eqir: (reg, A, B, C) => {
    reg[C] = A === reg[B] ? 1 : 0;
  },
  eqri: (reg, A, B, C) => {
    reg[C] = reg[A] === B ? 1 : 0;
  },
  eqrr: (reg, A, B, C) => {
    reg[C] = reg[A] === reg[B] ? 1 : 0;
  },
};

const runProgram = (part2 = false) => {
  const getOutVals = Array(max).fill(false);
  let prev = 0;
  let count = 0;

  const registers = [0, 0, 0, 0, 0, 0];
  let ptr = 0;
  let instruction;
  let A;
  let B;
  let C;
  const targetReg = instructions[28][1];

  while (ptr >= 0 && ptr < instructions.length) {
    if (ptr === 28) {
      if (getOutVals[registers[targetReg]]) {
        return prev;
      }
      getOutVals[registers[targetReg]] = true;
      prev = registers[targetReg];
      count++;
      if (count === 1 && !part2) {
        return prev;
      }
    }
    registers[ptrReg] = ptr;
    [instruction, A, B, C] = instructions[ptr];
    opCodes[instruction](registers, A, B, C);
    ptr = registers[ptrReg];
    ptr++;
  }
};

export const part1 = () => runProgram();

export const part2 = () => {
  console.log('This might take a few minutes...');
  return runProgram(true);
};
