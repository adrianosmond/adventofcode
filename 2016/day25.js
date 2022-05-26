import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import runProgram from './assembunny.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input25.txt'), 'utf8');

const instructions = input.split('\n').map((i) => {
  const [op, x, y] = i.split(' ');
  const xInt = parseInt(x, 10);
  const yInt = parseInt(y, 10);
  const xVal = Number.isNaN(xInt) ? x : xInt;
  const yVal = Number.isNaN(yInt) ? y : yInt;
  return [op, xVal, yVal];
});

const part1 = () => {
  for (let i = 1; i < 1000; i++) {
    let numOutputs = 0;
    for (const output of runProgram([i, 0, 0, 0], instructions)) {
      if (output !== numOutputs % 2) break;
      numOutputs++;
      if (numOutputs === 100) return i;
    }
  }
};

console.log('part1', part1());
