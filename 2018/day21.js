import { readInput } from '../utils/functions.js';

const input = readInput();

const [p, ...inst] = input.split('\n');
const ptrReg = parseInt(p.split(' ')[1], 10);
const instructions = inst
  .map((i) => i.split(' '))
  .map(([i, ...values]) => [i, ...values.map((v) => parseInt(v, 10))]);

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

const getOutVals = Array(16777215).fill(false);
let prev = 0;
let count = 0;

const registers = [0, 0, 0, 0, 0, 0];
let ptr = 0;
let instruction;
let A;
let B;
let C;
const targetReg = instructions[28][1];

console.log('You might have to wait a few minutes for part 2...');

while (ptr >= 0 && ptr < instructions.length) {
  if (ptr === 28) {
    if (getOutVals[registers[targetReg]]) {
      console.log('part2:');
      console.log(prev);
      break;
    }
    getOutVals[registers[targetReg]] = true;
    prev = registers[targetReg];
    count++;
    if (count === 1) {
      console.log('part1:');
      console.log(prev);
    }
  }
  registers[ptrReg] = ptr;
  [instruction, A, B, C] = instructions[ptr];
  opCodes[instruction](registers, A, B, C);
  ptr = registers[ptrReg];
  ptr++;
}
