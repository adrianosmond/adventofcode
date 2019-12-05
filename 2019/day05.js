const input = require('./input05'); // array of integers

const getCodeAndModes = instruction => {
  const opCode = instruction % 100;
  const mode1 = Math.floor(instruction / 100) % 10;
  const mode2 = Math.floor(instruction / 1000) % 10;
  const mode3 = Math.floor(instruction / 10000) % 10;
  return [opCode, mode1, mode2, mode3];
};

const getVal = (program, address, mode) =>
  mode === 0 ? program[address] : address;

const add = (program, ptr, mode1, mode2) => {
  const p1 = program[ptr + 1];
  const p2 = program[ptr + 2];
  return getVal(program, p1, mode1) + getVal(program, p2, mode2);
};

const mul = (program, ptr, mode1, mode2) => {
  const p1 = program[ptr + 1];
  const p2 = program[ptr + 2];
  return getVal(program, p1, mode1) * getVal(program, p2, mode2);
};

const lt = (program, ptr, mode1, mode2) => {
  const p1 = program[ptr + 1];
  const p2 = program[ptr + 2];
  return getVal(program, p1, mode1) < getVal(program, p2, mode2) ? 1 : 0;
};

const eq = (program, ptr, mode1, mode2) => {
  const p1 = program[ptr + 1];
  const p2 = program[ptr + 2];
  return getVal(program, p1, mode1) === getVal(program, p2, mode2) ? 1 : 0;
};

const intComputer = (intList, inputValue) => {
  const program = [...intList];

  let ptr = 0;
  let [opCode, mode1, mode2] = getCodeAndModes(program[ptr]);
  while (opCode !== 99) {
    if (opCode === 1) {
      program[program[ptr + 3]] = add(program, ptr, mode1, mode2);
      ptr += 4;
    } else if (opCode === 2) {
      program[program[ptr + 3]] = mul(program, ptr, mode1, mode2);
      ptr += 4;
    } else if (opCode === 3) {
      program[program[ptr + 1]] = inputValue;
      ptr += 2;
    } else if (opCode === 4) {
      console.log(getVal(program, program[ptr + 1], mode1));
      ptr += 2;
    } else if (opCode === 5) {
      if (getVal(program, program[ptr + 1], mode1) !== 0) {
        ptr = getVal(program, program[ptr + 2], mode2);
      } else {
        ptr += 3;
      }
    } else if (opCode === 6) {
      if (getVal(program, program[ptr + 1], mode1) === 0) {
        ptr = getVal(program, program[ptr + 2], mode2);
      } else {
        ptr += 3;
      }
    } else if (opCode === 7) {
      program[program[ptr + 3]] = lt(program, ptr, mode1, mode2);
      ptr += 4;
    } else if (opCode === 8) {
      program[program[ptr + 3]] = eq(program, ptr, mode1, mode2);
      ptr += 4;
    }
    [opCode, mode1, mode2] = getCodeAndModes(program[ptr]);
  }
};

console.log('part 1:');
intComputer(input, 1);
console.log('part 2:');
intComputer(input, 5);
