import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { strToIntArray } from '../utils/functions.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input25.txt'), 'utf8');

const [card, door] = strToIntArray(input);

const part1 = () => {
  let value = 1;
  let loops = 0;

  while (value !== card) {
    value *= 7;
    value %= 20201227;
    loops++;
  }

  value = 1;

  for (let i = 0; i < loops; i++) {
    value *= door;
    value %= 20201227;
  }

  return value;
};

console.log('part1', part1());
