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

const getValues = (program, ptr, mode1, mode2, mode3, relativeBase) => {
  const p1 = program[ptr + 1];
  const p2 = program[ptr + 2];
  return [
    getVal(program, p1, mode1, relativeBase),
    getVal(program, p2, mode2, relativeBase),
    (mode3 === 2 ? relativeBase : 0) + program[ptr + 3],
  ];
};

function* intComputer(intList, inputValues) {
  const program = [...intList, ...new Array(memBuffer).fill(0)];
  let inputPtr = 0;
  let ptr = 0;
  let rel = 0;

  let [opCode, mode1, mode2, mode3] = getCodeAndModes(program[ptr]);
  while (opCode !== 99) {
    const [v1, v2, v3] = getValues(program, ptr, mode1, mode2, mode3, rel);
    if (opCode === 1) {
      program[v3] = v1 + v2;
      ptr += 4;
    } else if (opCode === 2) {
      program[v3] = v1 * v2;
      ptr += 4;
    } else if (opCode === 3) {
      if (mode1 === 2) {
        program[rel + program[ptr + 1]] = inputValues[inputPtr];
      } else {
        program[v1] = inputValues[inputPtr];
      }
      inputPtr++;
      ptr += 2;
    } else if (opCode === 4) {
      yield v1;
      ptr += 2;
    } else if (opCode === 5) {
      if (v1 !== 0) {
        ptr = v2;
      } else {
        ptr += 3;
      }
    } else if (opCode === 6) {
      if (v1 === 0) {
        ptr = v2;
      } else {
        ptr += 3;
      }
    } else if (opCode === 7) {
      program[v3] = v1 < v2 ? 1 : 0;
      ptr += 4;
    } else if (opCode === 8) {
      program[v3] = v1 === v2 ? 1 : 0;
      ptr += 4;
    } else if (opCode === 9) {
      rel += v1;
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
