const input = require('./input02'); // array of integers

const intComputer = (input, noun, verb) => {
  input[1] = noun;
  input[2] = verb;

  var ptr = 0;
  while (true) {
    var opCode = input[ptr];
    if (opCode === 99) {
      break;
    }
    var p1 = input[ptr + 1];
    var p2 = input[ptr + 2];
    var p3 = input[ptr + 3];
    if (opCode === 1) {
      input[p3] = input[p1] + input[p2];
    } else if (opCode === 2) {
      input[p3] = input[p1] * input[p2];
    }
    ptr += 4;
  }
  return input[0];
};

function part2() {
  for (var noun = 0; noun <= 99; noun++) {
    for (var verb = 0; verb <= 99; verb++) {
      if (intComputer([...input], noun, verb) === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
}

console.log('part 1:', intComputer([...input], 12, 2));
console.log('part 2:', part2());
