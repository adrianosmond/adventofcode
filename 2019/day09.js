const input = require('./input09'); // Array of integers

const memBuffer = 10000;

const getCodeAndModes = instruction => {
  const opCode = instruction % 100;
  const mode1 = Math.floor(instruction / 100) % 10;
  const mode2 = Math.floor(instruction / 1000) % 10;
  const mode3 = Math.floor(instruction / 10000) % 10;
  return [opCode, mode1, mode2, mode3];
};

const getVal = (program, address, mode, relativeBase) => {
  // Parameter mode
  if (mode === 0) {
    return program[address];
  }
  // Position mode
  if (mode === 1) {
    return address;
  }
  // Relative mode
  return program[relativeBase + address];
};

const getValues = (program, ptr, mode1, mode2, relativeBase) => {
  const p1 = program[ptr + 1];
  const p2 = program[ptr + 2];
  return [
    getVal(program, p1, mode1, relativeBase),
    getVal(program, p2, mode2, relativeBase),
  ];
};

const add = (program, ptr, mode1, mode2, relativeBase) => {
  const [v1, v2] = getValues(program, ptr, mode1, mode2, relativeBase);
  return v1 + v2;
};

const mul = (program, ptr, mode1, mode2, relativeBase) => {
  const [v1, v2] = getValues(program, ptr, mode1, mode2, relativeBase);
  return v1 * v2;
};

const lt = (program, ptr, mode1, mode2, relativeBase) => {
  const [v1, v2] = getValues(program, ptr, mode1, mode2, relativeBase);
  return v1 < v2 ? 1 : 0;
};

const eq = (program, ptr, mode1, mode2, relativeBase) => {
  const [v1, v2] = getValues(program, ptr, mode1, mode2, relativeBase);
  return v1 === v2 ? 1 : 0;
};

function* intComputer(intList, inputValues) {
  const program = [...intList, ...new Array(memBuffer).fill(0)];
  let inputPtr = 0;
  let ptr = 0;
  let rb = 0;

  let [opCode, mode1, mode2, mode3] = getCodeAndModes(program[ptr]);
  while (opCode !== 99) {
    if (opCode === 1) {
      if (mode3 === 2) {
        program[rb + program[ptr + 3]] = add(program, ptr, mode1, mode2, rb);
      } else {
        program[program[ptr + 3]] = add(program, ptr, mode1, mode2, rb);
      }
      ptr += 4;
    } else if (opCode === 2) {
      if (mode3 === 2) {
        program[rb + program[ptr + 3]] = mul(program, ptr, mode1, mode2, rb);
      } else {
        program[program[ptr + 3]] = mul(program, ptr, mode1, mode2, rb);
      }
      ptr += 4;
    } else if (opCode === 3) {
      const p1 = program[ptr + 1];
      if (mode1 === 0) {
        program[program[p1]] = inputValues[inputPtr];
      } else if (mode1 === 1) {
        program[p1] = inputValues[inputPtr];
      } else if (mode1 === 2) {
        program[rb + p1] = inputValues[inputPtr];
      }
      inputPtr++;
      ptr += 2;
    } else if (opCode === 4) {
      yield getVal(program, program[ptr + 1], mode1, rb);
      ptr += 2;
    } else if (opCode === 5) {
      const [v1, v2] = getValues(program, ptr, mode1, mode2, rb);
      if (v1 !== 0) {
        ptr = v2;
      } else {
        ptr += 3;
      }
    } else if (opCode === 6) {
      const [v1, v2] = getValues(program, ptr, mode1, mode2, rb);
      if (v1 === 0) {
        ptr = v2;
      } else {
        ptr += 3;
      }
    } else if (opCode === 7) {
      if (mode3 === 2) {
        program[rb + program[ptr + 3]] = lt(program, ptr, mode1, mode2, rb);
      } else {
        program[program[ptr + 3]] = lt(program, ptr, mode1, mode2, rb);
      }
      ptr += 4;
    } else if (opCode === 8) {
      if (mode3 === 2) {
        program[rb + program[ptr + 3]] = eq(program, ptr, mode1, mode2, rb);
      } else {
        program[program[ptr + 3]] = eq(program, ptr, mode1, mode2, rb);
      }
      ptr += 4;
    } else if (opCode === 9) {
      rb += getVal(program, program[ptr + 1], mode1, rb);
      ptr += 2;
    }
    [opCode, mode1, mode2, mode3] = getCodeAndModes(program[ptr]);
  }
}

for (const output of intComputer(input, [1])) {
  console.log('part1:', output);
}

for (const output of intComputer(input, [2])) {
  console.log('part2:', output);
}
