const input = require('./input12');

const instructions = input.split('\n').map(i => {
  const [op, x, y] = i.split(' ');
  const xInt = parseInt(x, 10);
  const yInt = parseInt(y, 10);
  const xVal = Number.isNaN(xInt) ? x : xInt;
  const yVal = Number.isNaN(yInt) ? y : yInt;
  return [op, xVal, yVal];
});

const regKey = { a: 0, b: 1, c: 2, d: 3 };
let registers;
let iPtr = 0;

const opCodes = {
  cpy: (X, Y) => {
    registers[regKey[Y]] = typeof X === 'number' ? X : registers[regKey[X]];
  },
  inc: X => {
    registers[regKey[X]]++;
  },
  dec: X => {
    registers[regKey[X]]--;
  },
  jnz: (X, Y) => {
    const xVal = typeof X === 'number' ? X : registers[regKey[X]];
    const yVal = typeof Y === 'number' ? Y : registers[regKey[Y]];

    if (xVal !== 0) {
      iPtr += yVal - 1;
    }
  },
};

const runProgram = initialRegisters => {
  registers = initialRegisters;
  iPtr = 0;
  while (iPtr < instructions.length) {
    const [op, x, y] = instructions[iPtr];
    opCodes[op](x, y);
    iPtr++;
  }
  return registers[0];
};

console.log('part1:', runProgram([0, 0, 0, 0]));
console.log('part2:', runProgram([0, 0, 1, 0]));
