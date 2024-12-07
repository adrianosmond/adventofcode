import readInput from '../utils/readInput.ts';
import { multilineStrToIntArrays } from '../utils/functions.ts';

const input = readInput();
const [s, p] = input.split('\n\n\n\n');

const samples = s
  .replace(/Before: \[/g, '')
  .replace(/After: {2}\[/g, '')
  .replace(/\]/g, '')
  .replace(/,/g, '')
  .split('\n\n')
  .map((i) => multilineStrToIntArrays(i));

const program = multilineStrToIntArrays(p);

type Instruction = keyof typeof instructions;
type Values = [number, number, number];

const instructions = {
  addr: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] + reg[B];
    return newReg;
  },
  addi: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] + B;
    return newReg;
  },
  mulr: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] * reg[B];
    return newReg;
  },
  muli: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] * B;
    return newReg;
  },
  banr: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] & reg[B];
    return newReg;
  },
  bani: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] & B;
    return newReg;
  },
  borr: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] | reg[B];
    return newReg;
  },
  bori: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] | B;
    return newReg;
  },
  setr: (reg: number[], [A, , C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A];
    return newReg;
  },
  seti: (reg: number[], [A, , C]: Values) => {
    const newReg = [...reg];
    newReg[C] = A;
    return newReg;
  },
  gtir: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = A > reg[B] ? 1 : 0;
    return newReg;
  },
  gtri: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] > B ? 1 : 0;
    return newReg;
  },
  gtrr: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] > reg[B] ? 1 : 0;
    return newReg;
  },
  eqir: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = A === reg[B] ? 1 : 0;
    return newReg;
  },
  eqri: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] === B ? 1 : 0;
    return newReg;
  },
  eqrr: (reg: number[], [A, B, C]: Values) => {
    const newReg = [...reg];
    newReg[C] = reg[A] === reg[B] ? 1 : 0;
    return newReg;
  },
};

const compare = (a: unknown[], b: unknown[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const part1 = () =>
  samples.reduce((total, sample) => {
    const [before, instruction, after] = sample;
    const [, ...values] = instruction;
    const matches = Object.values(instructions).reduce(
      (prev, op) =>
        prev + (compare(after, op(before, values as Values)) ? 1 : 0),
      0,
    );
    return total + (matches >= 3 ? 1 : 0);
  }, 0);

export const part2 = () => {
  const opCodes: string[][] = [];
  for (let i = 0; i < 16; i++) {
    opCodes[i] = Object.keys(instructions);
  }

  samples.forEach((sample) => {
    const [before, instruction, after] = sample;
    const [opCode, ...values] = instruction;
    const toTest = [...opCodes[opCode]] as Instruction[];
    toTest.forEach((op) => {
      if (!compare(after, instructions[op](before, values as Values))) {
        opCodes[opCode] = opCodes[opCode].filter((x) => x !== op);
      }
    }, 0);
  });

  const known: string[] = [];
  for (let i = 0; i < opCodes.length; i++) {
    if (opCodes[i].length === 1) known.push(opCodes[i][0]);
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < opCodes.length; i++) {
      const prevLen = opCodes[i].length;
      if (prevLen > 1) {
        opCodes[i] = opCodes[i].filter((x) => known.indexOf(x) < 0);
        const newLen = opCodes[i].length;
        if (newLen < prevLen) {
          changed = true;
          if (newLen === 1) {
            known.push(opCodes[i][0]);
          }
        }
      }
    }
  }

  const finalOpCodes = opCodes.map((o) => o[0]);
  let registers = [0, 0, 0, 0];
  program.forEach(([opCode, ...values]) => {
    const instruction = instructions[finalOpCodes[opCode] as Instruction];
    registers = instruction(registers, values as Values);
  });

  return registers[0];
};
