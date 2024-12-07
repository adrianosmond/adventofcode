const memBuffer = 10000;

const getCodeAndModes = (instruction: number) => {
  const opCode = instruction % 100;
  const mode1 = Math.floor(instruction / 100) % 10;
  const mode2 = Math.floor(instruction / 1000) % 10;
  const mode3 = Math.floor(instruction / 10000) % 10;
  return [opCode, mode1, mode2, mode3];
};

const getVal = (
  program: number[],
  address: number,
  mode: number,
  relativeBase: number,
) => {
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

const getValues = (
  program: number[],
  ptr: number,
  mode1: number,
  mode2: number,
  mode3: number,
  relativeBase: number,
) => {
  const p1 = program[ptr + 1];
  const p2 = program[ptr + 2];
  return [
    getVal(program, p1, mode1, relativeBase),
    getVal(program, p2, mode2, relativeBase),
    (mode3 === 2 ? relativeBase : 0) + program[ptr + 3],
  ];
};

type IntCompupterOptions = {
  blockForInput: boolean;
  emptyInputArray: boolean;
};
function* intComputer(
  intList: number[],
  inputValues: number[],
  options: Partial<IntCompupterOptions> = {},
) {
  const blockForInput = !!options.blockForInput;
  const emptyInputArray = !!options.emptyInputArray;
  const program = [...intList, ...new Array(memBuffer).fill(0)];
  let ptr = 0;
  let inputPtr = 0;
  let rel = 0;

  let [opCode, mode1, mode2, mode3] = getCodeAndModes(program[ptr]);
  while (opCode > 0 && opCode < 10) {
    const [v1, v2, v3] = getValues(program, ptr, mode1, mode2, mode3, rel);
    if (opCode === 1) {
      program[v3] = v1 + v2;
      ptr += 4;
    } else if (opCode === 2) {
      program[v3] = v1 * v2;
      ptr += 4;
    } else if (opCode === 3) {
      if (blockForInput) {
        yield Number.MIN_SAFE_INTEGER;
      }
      let val;
      if (emptyInputArray) {
        val = inputValues.shift();
      } else {
        val = inputValues[inputPtr];
        if (val !== undefined) {
          inputPtr++;
        }
      }
      if (mode1 === 2) {
        program[rel + program[ptr + 1]] = val;
      } else {
        program[program[ptr + 1]] = val;
      }
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

function* getNOutputs(n: number, computer: ReturnType<typeof intComputer>) {
  let outputs = [];
  for (const output of computer) {
    outputs.push(output);
    if (outputs.length === n) {
      yield outputs;
      outputs = [];
    }
  }
}

export { intComputer, getNOutputs };
