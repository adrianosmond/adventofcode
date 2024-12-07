import md5 from 'spark-md5';
import readInput from '../utils/readInput.ts';

const input = readInput();

const findCoin = (start: string) => {
  let number = 1;
  while (true) {
    if (md5.hashBinary(`${input}${number}`).startsWith(start)) {
      break;
    }
    number++;
  }
  return number;
};

export const part1 = () => findCoin('00000');

export const part2 = () => findCoin('000000');
