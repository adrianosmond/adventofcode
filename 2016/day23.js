const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.resolve(__dirname, 'input23.txt'), 'utf8');

const makeInstructions = () => {
  const instrs = input.split('\n').map((i) => {
    const [op, x, y] = i.split(' ');
    const xInt = parseInt(x, 10);
    const yInt = parseInt(y, 10);
    const xVal = Number.isNaN(xInt) ? x : xInt;
    const yVal = Number.isNaN(yInt) ? y : yInt;
    return [op, xVal, yVal];
  });
  return instrs;
};

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
        throw new Error('Unexpected instruction');
    }
  },
};

const runProgram = (initialRegisters) => {
  registers = initialRegisters;
  iPtr = 0;
  instructions = makeInstructions();
  while (iPtr < instructions.length) {
    const [op, x, y] = instructions[iPtr];
    opCodes[op](x, y);
    iPtr++;
  }
  return registers[0];
};

const part1 = () => runProgram([7, 0, 0, 0]);

const part2 = () => runProgram([12, 0, 0, 0]);

console.log('part1', part1());

console.log('Part 2 is going to take a few minutes...');

console.log('part2', part2());
