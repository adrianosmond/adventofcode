import readInput from '../utils/readInput.ts';

const input = readInput();

type Instruction = [string, number, number, number];

function parseInstruction(parts: string[]): Instruction {
  const [op, ...values] = parts;
  const nums = values.map((v) => parseInt(v, 10));
  return [op, nums[0], nums[1], nums[2]];
}

const [p, ...inst] = input.split('\n');
const ptrReg = parseInt(p.split(' ')[1], 10);
const instructions = inst.map((i) => parseInstruction(i.split(' ')));

type OpCodeFn = (reg: number[], A: number, B: number, C: number) => void;

const opCodes: Record<string, OpCodeFn> = {
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

const runProgram = (part2 = false): number => {
  const getOutVals = new Set<number>();
  let prev = 0;
  let count = 0;

  const registers = [0, 0, 0, 0, 0, 0];
  let ptr = 0;
  const targetReg = instructions[28][1];

  while (ptr >= 0 && ptr < instructions.length) {
    if (ptr === 28) {
      if (getOutVals.has(registers[targetReg])) {
        return prev;
      }
      getOutVals.add(registers[targetReg]);
      prev = registers[targetReg];
      count++;
      if (count === 1 && !part2) {
        return prev;
      }
    }
    registers[ptrReg] = ptr;
    const [instruction, A, B, C] = instructions[ptr];
    opCodes[instruction](registers, A, B, C);
    ptr = registers[ptrReg];
    ptr++;
  }
  throw new Error('No solution found');
};

export const part1 = () => runProgram();

export const part2 = () => {
  console.log('This might take a few minutes...');
  return runProgram(true);
};
