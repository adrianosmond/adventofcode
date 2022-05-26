import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { strToIntArray } from '../utils/functions.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input15.txt'), 'utf8');

const numbers = strToIntArray(input, ',');

const getNthNumber = (maxTurn) => {
  const history = new Array(maxTurn).fill(-1);
  let spoken;
  let lastSpoken;

  for (let turn = 0; turn < maxTurn; turn++) {
    lastSpoken = spoken;
    if (turn < numbers.length) {
      spoken = numbers[turn];
    } else if (history[lastSpoken] < 0) {
      spoken = 0;
    } else {
      spoken = turn - history[lastSpoken];
    }

    history[lastSpoken] = turn;
  }

  return spoken;
};

const part1 = () => getNthNumber(2020);
const part2 = () => getNthNumber(30000000);

console.log('part1', part1());
console.log('part2', part2());
