import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const message = strToIntArray(input);

const day5part1 = () => {
  const jumps = [...message];
  let currentPosition = 0;
  let loop = 0;

  while (currentPosition > -1 && currentPosition < jumps.length) {
    const jump = jumps[currentPosition];
    jumps[currentPosition]++;
    currentPosition += jump;
    loop++;
  }
  return loop;
};

const day5part2 = () => {
  const jumps = [...message];
  let currentPosition = 0;
  let loop = 0;

  while (currentPosition > -1 && currentPosition < jumps.length) {
    const jump = jumps[currentPosition];
    if (jump >= 3) {
      jumps[currentPosition]--;
    } else {
      jumps[currentPosition]++;
    }
    currentPosition += jump;
    loop++;
  }
  return loop;
};

console.log('part1:', day5part1());
console.log('part2:', day5part2());
