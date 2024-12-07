import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();

const [card, door] = strToIntArray(input);

export const part1 = () => {
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
