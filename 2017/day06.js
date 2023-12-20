import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { highestWithIndex } from '../utils/reducers.js';

const input = strToIntArray(readInput(), '\t');

const banks = input.length;
let loops = 0;
const history = [];
let prevIndex = -1;

while (true) {
  const { best, index } = input.reduce(highestWithIndex, {
    best: -1,
    index: -1,
  });
  const fraction = best / banks;
  const floor = Math.floor(fraction);
  const ceil = Math.ceil(fraction);
  let remainder = best % banks;
  input[index] = 0;
  for (let j = 1; j <= banks; j++) {
    if (remainder > 0) {
      input[(index + j) % banks] += ceil;
      remainder--;
    } else {
      input[(index + j) % banks] += floor;
    }
  }
  loops++;
  const state = input.join(',');
  prevIndex = history.indexOf(state);
  if (prevIndex > -1) {
    break;
  } else {
    history.push(state);
  }
}

export const part1 = () => loops;

export const part2 = () => loops - prevIndex - 1;
