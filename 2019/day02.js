const input = require('./input02'); // array of integers

const intComputer = (intList, noun, verb) => {
  const program = [...intList];
  program[1] = noun;
  program[2] = verb;

  let ptr = 0;
  let opCode = program[ptr];
  while (opCode !== 99) {
    const p1 = program[ptr + 1];
    const p2 = program[ptr + 2];
    const p3 = program[ptr + 3];
    if (opCode === 1) {
      program[p3] = program[p1] + program[p2];
    } else if (opCode === 2) {
      program[p3] = program[p1] * program[p2];
    }
    ptr += 4;
    opCode = program[ptr];
  }
  return program[0];
};

const part2 = () => {
  for (let noun = 0; noun <= 99; noun += 1) {
    for (let verb = 0; verb <= 99; verb += 1) {
      if (intComputer(input, noun, verb) === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
  return 'failed';
};

console.log('part1:', intComputer(input, 12, 2));
console.log('part2:', part2());
