import { sum } from '../utils/reducers.ts';

import readInput from '../utils/readInput.ts';

const input = readInput();

const [p, ...inst] = input.split('\n');
const ptrReg = parseInt(p.split(' ')[1], 10);
const instructions = inst
  .map((i) => i.split(' '))
  .map(
    ([i, ...values]) =>
      [i, ...values.map((v) => parseInt(v, 10))] as [
        string,
        number,
        number,
        number,
      ],
  );

const findFactors = (n: number) => {
  let factor = 2;
  const factors = [];
  while (n >= factor) {
    if (n % factor === 0) {
      factors.push(factor);
    }
    factor++;
  }
  return factors;
};

const opCodes: Record<
  string,
  (reg: number[], A: number, B: number, C: number) => void
> = {
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

export const part1 = () => {
  const registers = [0, 0, 0, 0, 0, 0];
  let ptr = 0;
  let instruction: string;
  let A: number;
  let B: number;
  let C: number;
  while (ptr >= 0 && ptr < instructions.length) {
    registers[ptrReg] = ptr;
    [instruction, A, B, C] = instructions[ptr];
    opCodes[instruction](registers, A, B, C);
    ptr = registers[ptrReg];
    ptr++;
  }
  return registers[0];
};

/* After analysis it looks like the program is finding the factors of
   the large number and summing them up. Let's run the program until
   the large number is in one of the registers and then do the
   factoring and summing ourselves */
export const part2 = () => {
  const registers = [1, 0, 0, 0, 0, 0];
  let ptr = 0;
  let instruction;
  let A;
  let B;
  let C;
  for (let i = 0; i < 20; i++) {
    registers[ptrReg] = ptr;
    [instruction, A, B, C] = instructions[ptr];
    opCodes[instruction](registers, A, B, C);
    ptr = registers[ptrReg];
    ptr++;
  }
  const factors = findFactors(Math.max(...registers));
  return factors.reduce(sum, 1);
};
