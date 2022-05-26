import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import md5 from 'spark-md5';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input04.txt'), 'utf8');

const findCoin = (start) => {
  let number = 1;
  while (true) {
    if (md5.hashBinary(`${input}${number}`).startsWith(start)) {
      break;
    }
    number++;
  }
  return number;
};

const part1 = () => findCoin('00000');

const part2 = () => findCoin('000000');

console.log('part1', part1());
console.log('part2', part2());
