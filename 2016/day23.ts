import readInput from '../utils/readInput.ts';
import runProgram, { type Instruction } from './assembunny.ts';

const input = readInput();

const makeInstructions = () => {
  const instrs = input.split('\n').map((i) => {
    const [op, x, y] = i.split(' ');
    const xInt = parseInt(x, 10);
    const yInt = parseInt(y, 10);
    const xVal = Number.isNaN(xInt) ? x : xInt;
    const yVal = Number.isNaN(yInt) ? y : yInt;
    return [op, xVal, yVal] as Instruction;
  });
  return instrs;
};
export const part1 = () =>
  runProgram([7, 0, 0, 0], makeInstructions()).next().value;

export const part2 = () =>
  runProgram([12, 0, 0, 0], makeInstructions()).next().value;
