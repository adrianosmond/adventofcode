import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();

const numbers = strToIntArray(input, ',');

const getNthNumber = (maxTurn: number) => {
  const history = new Array(maxTurn).fill(-1);
  let spoken;
  let lastSpoken;

  for (let turn = 0; turn < maxTurn; turn++) {
    lastSpoken = spoken;
    if (turn < numbers.length) {
      spoken = numbers[turn];
    } else if (history[lastSpoken!] < 0) {
      spoken = 0;
    } else {
      spoken = turn - history[lastSpoken!];
    }

    history[lastSpoken!] = turn;
  }

  return spoken;
};

export const part1 = () => getNthNumber(2020);

export const part2 = () => getNthNumber(30000000);
