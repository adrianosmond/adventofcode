import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import runProgram from './assembunny.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input23.txt'), 'utf8');

const makeInstructions = () => {
  const instrs = input.split('\n').map((i) => {
    const [op, x, y] = i.split(' ');
    const xInt = parseInt(x, 10);
    const yInt = parseInt(y, 10);
    const xVal = Number.isNaN(xInt) ? x : xInt;
    const yVal = Number.isNaN(yInt) ? y : yInt;
    return [op, xVal, yVal];
  });
  return instrs;
};
const part1 = () => runProgram([7, 0, 0, 0], makeInstructions()).next().value;

const part2 = () => runProgram([12, 0, 0, 0], makeInstructions()).next().value;

console.log('part1', part1());
console.log('part2', part2());
