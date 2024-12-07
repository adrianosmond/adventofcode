import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();
const message = strToIntArray(input);

export const part1 = () => {
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

export const part2 = () => {
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
