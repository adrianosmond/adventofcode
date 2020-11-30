const { input, input2 } = require('./input16');

const instructions = {
  addr: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] + reg[B];
    return newReg;
  },
  addi: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] + B;
    return newReg;
  },
  mulr: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] * reg[B];
    return newReg;
  },
  muli: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] * B;
    return newReg;
  },
  banr: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] & reg[B];
    return newReg;
  },
  bani: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] & B;
    return newReg;
  },
  borr: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] | reg[B];
    return newReg;
  },
  bori: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] | B;
    return newReg;
  },
  setr: (reg, [A, , C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A];
    return newReg;
  },
  seti: (reg, [A, , C]) => {
    const newReg = [...reg];
    newReg[C] = A;
    return newReg;
  },
  gtir: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = A > reg[B] ? 1 : 0;
    return newReg;
  },
  gtri: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] > B ? 1 : 0;
    return newReg;
  },
  gtrr: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] > reg[B] ? 1 : 0;
    return newReg;
  },
  eqir: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = A === reg[B] ? 1 : 0;
    return newReg;
  },
  eqri: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] === B ? 1 : 0;
    return newReg;
  },
  eqrr: (reg, [A, B, C]) => {
    const newReg = [...reg];
    newReg[C] = reg[A] === reg[B] ? 1 : 0;
    return newReg;
  },
};

const compare = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const day16part1 = () =>
  input.reduce((total, sample) => {
    const [before, instruction, after] = sample;
    const [, ...values] = instruction;
    const matches = Object.values(instructions).reduce(
      (prev, op) => prev + (compare(after, op(before, values)) ? 1 : 0),
      0,
    );
    return total + (matches >= 3 ? 1 : 0);
  }, 0);

const day16part2 = () => {
  let opCodes = [];
  for (let i = 0; i < 16; i++) {
    opCodes[i] = Object.keys(instructions);
  }

  input.forEach((sample) => {
    const [before, instruction, after] = sample;
    const [opCode, ...values] = instruction;
    const toTest = [...opCodes[opCode]];
    toTest.forEach((op) => {
      if (!compare(after, instructions[op](before, values))) {
        opCodes[opCode] = opCodes[opCode].filter((x) => x !== op);
      }
    }, 0);
  });

  const known = [];
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
  opCodes = opCodes.map((o) => o[0]);

  let registers = [0, 0, 0, 0];
  input2.forEach(([opCode, ...values]) => {
    const instruction = instructions[opCodes[opCode]];
    registers = instruction(registers, values);
  });

  return registers[0];
};

console.log('part1:', day16part1());
console.log('part2:', day16part2());
