import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { intComputer, getNOutputs } from './intComputer.ts';

const input = strToIntArray(readInput(), ',');

export const part1 = () => {
  const computer = intComputer(input, []);
  let blocks = 0;
  for (const [, , output] of getNOutputs(3, computer)) {
    if (output === 2) blocks++;
  }
  return blocks;
};

export const part2 = () => {
  const program = [...input];
  program[0] = 2;
  const inputs: number[] = [];
  const computer = intComputer(program, inputs);

  let score = 0;
  let paddleX: number;

  for (const [x, , output] of getNOutputs(3, computer)) {
    if (x === -1) {
      score = output;
    } else if (output === 3) {
      paddleX = x;
    } else if (output === 4) {
      if (x < paddleX!) {
        inputs.push(-1);
      } else if (x > paddleX!) {
        inputs.push(1);
      }
    }
  }
  return score;
};
