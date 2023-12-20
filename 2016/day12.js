import readInput from '../utils/readInput.js';
import runProgram from './assembunny.js';

const input = readInput();

const instructions = input.split('\n').map((i) => {
  const [op, x, y] = i.split(' ');
  const xInt = parseInt(x, 10);
  const yInt = parseInt(y, 10);
  const xVal = Number.isNaN(xInt) ? x : xInt;
  const yVal = Number.isNaN(yInt) ? y : yInt;
  return [op, xVal, yVal];
});

export const part1 = () => runProgram([0, 0, 0, 0], instructions).next().value;

export const part2 = () => runProgram([0, 0, 1, 0], instructions).next().value;
