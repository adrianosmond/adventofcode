const input = require('./input13');
const { intComputer, getNOutputs } = require('./intComputer');

const day12part1 = () => {
  const computer = intComputer(input, []);
  let blocks = 0;
  for (const [, , output] of getNOutputs(3, computer)) {
    if (output === 2) blocks++;
  }
  return blocks;
};

const day12part2 = () => {
  const program = [...input];
  program[0] = 2;
  const inputs = [];
  const computer = intComputer(program, inputs);

  let score = 0;
  let paddleX;

  for (const [x, , output] of getNOutputs(3, computer)) {
    if (x === -1) {
      score = output;
    } else if (output === 3) {
      paddleX = x;
    } else if (output === 4) {
      if (paddleX) {
        if (x < paddleX) {
          inputs.push(-1);
        } else if (x > paddleX) {
          inputs.push(1);
        }
      }
    }
  }
  return score;
};

console.log('part1:', day12part1());
console.log('part2:', day12part2());
