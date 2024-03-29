import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();

const expenses = strToIntArray(input);

const map = {};
for (const number of expenses) {
  map[number] = true;
}

export const part1 = () => {
  for (let i = 0; i < expenses.length; i++) {
    const number1 = expenses[i];
    const number2 = 2020 - number1;
    if (map[number2]) {
      return number1 * number2;
    }
  }
};

export const part2 = () => {
  for (let i = 0; i < expenses.length; i++) {
    const number1 = expenses[i];
    for (let j = i + 1; j < expenses.length; j++) {
      const number2 = expenses[j];
      if (number1 + number2 > 2020) {
        continue;
      }

      const number3 = 2020 - (number1 + number2);

      if (map[number3]) {
        return number1 * number2 * number3;
      }
    }
  }
};
