const input = require('./input07');

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

function* intComputer(intList, inputValues) {
  const program = [...intList];
  let inputPtr = 0;

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
      program[program[ptr + 1]] = inputValues[inputPtr];
      inputPtr++;
      ptr += 2;
    } else if (opCode === 4) {
      yield getVal(program, program[ptr + 1], mode1);
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
}

const makeAmplifier = inputValues => intComputer(input, inputValues);

function* choose5(start = 0) {
  for (let A = start; A < start + 5; A++) {
    for (let B = start; B < start + 5; B++) {
      if (B !== A) {
        for (let C = start; C < start + 5; C++) {
          if (C !== A && C !== B) {
            for (let D = start; D < start + 5; D++) {
              if (D !== A && D !== B && D !== C) {
                for (let E = start; E < start + 5; E++) {
                  if (E !== A && E !== B && E !== C && E !== D) {
                    yield [A, B, C, D, E];
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const day7part1 = () => {
  let bestOutput = Number.MIN_SAFE_INTEGER;
  let lastOutput = 0;

  for (const phases of choose5()) {
    lastOutput = phases.reduce(
      (prev, phase) => intComputer(input, [phase, prev]).next().value,
      0,
    );
    bestOutput = Math.max(lastOutput, bestOutput);
  }
  return bestOutput;
};

const runAmp = (amp, ampInputs, prevAmpOutput) => {
  ampInputs.push(prevAmpOutput);
  const { value } = amp.next();
  if (value) {
    return [value, false];
  }
  return [prevAmpOutput, true];
};

const day7part2 = () => {
  let bestOutput = Number.MIN_SAFE_INTEGER;

  for (const phases of choose5(5)) {
    const inputs = phases.map(phase => [phase]);
    const amps = inputs.map(i => makeAmplifier(i));
    let lastOutput = 0;
    let done = false;

    while (!done) {
      [lastOutput, done] = amps.reduce(
        ([prev], amp, idx) => runAmp(amp, inputs[idx], prev),
        [lastOutput, done],
      );
    }

    bestOutput = Math.max(lastOutput, bestOutput);
  }
  return bestOutput;
};

console.log('part1:', day7part1());
console.log('part2:', day7part2());
