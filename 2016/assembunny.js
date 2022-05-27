const regKey = { a: 0, b: 1, c: 2, d: 3 };
let registers;
let iPtr = 0;
let instructions;

const opCodes = {
  cpy: (X, Y) => {
    registers[regKey[Y]] = typeof X === 'number' ? X : registers[regKey[X]];
  },
  inc: (X) => {
    registers[regKey[X]]++;
  },
  dec: (X) => {
    registers[regKey[X]]--;
  },
  jnz: (X, Y) => {
    const xVal = typeof X === 'number' ? X : registers[regKey[X]];
    const yVal = typeof Y === 'number' ? Y : registers[regKey[Y]];

    if (xVal !== 0) {
      iPtr += yVal - 1;
    }
  },
  add: (X, Y) => {
    registers[regKey[X]] += registers[regKey[Y]];
  },
  mul: (X, Y) => {
    registers[regKey[X]] *= registers[regKey[Y]];
  },
  tgl: (X) => {
    const xVal = typeof X === 'number' ? X : registers[regKey[X]];
    if (iPtr + xVal > instructions.length - 1) return;
    switch (instructions[iPtr + xVal][0]) {
      case 'cpy':
        instructions[iPtr + xVal][0] = 'jnz';
        break;
      case 'inc':
        instructions[iPtr + xVal][0] = 'dec';
        break;
      case 'dec':
        instructions[iPtr + xVal][0] = 'inc';
        break;
      case 'jnz':
        instructions[iPtr + xVal][0] = 'cpy';
        break;
      default:
    }
  },
};

// Assembunny only has incrememnt and decrement so multiplications are really slow
// We can optimize them out by adding a couple of new operations to the language
// and using them instead
const optimizeMultiplications = () => {
  for (let i = 2; i < instructions.length - 2; i++) {
    const [op0, x0] = instructions[i - 2];
    const [, x1] = instructions[i - 1];
    const [op2, x2, y2] = instructions[i];
    const [, x3] = instructions[i + 2];
    const [op4, x4, y4] = instructions[i + 2];
    if (
      op0 === 'inc' &&
      op2 === 'jnz' &&
      y2 === -2 &&
      op4 === 'jnz' &&
      y4 === -5 &&
      x1 === x2 &&
      x3 === x4
    ) {
      // We have a multiplication... We can optimize it.
      instructions[i - 2] = ['mul', x1, x3];
      instructions[i - 1] = ['add', x0, x1];
      instructions[i] = ['jnz', 0, 0];
      instructions[i + 1] = ['jnz', 0, 0];
      instructions[i + 2] = ['jnz', 0, 0];
    }
  }
};

export default function* runProgram(initialRegisters, ins) {
  registers = initialRegisters;
  iPtr = 0;
  instructions = ins;
  optimizeMultiplications();
  while (iPtr < instructions.length) {
    const [op, x, y] = instructions[iPtr];
    if (op === 'out') {
      const xVal = typeof x === 'number' ? x : registers[regKey[x]];
      yield xVal;
    } else {
      opCodes[op](x, y);
    }
    iPtr++;
  }
  yield registers[0];
}
