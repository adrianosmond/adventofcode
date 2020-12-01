const fs = require('fs');
const path = require('path');
const { strToIntArray } = require('../utils/functions');

const input = strToIntArray(
  fs.readFileSync(path.resolve(__dirname, 'input01.txt'), 'utf8'),
);

const map = {};
for (const number of input) {
  map[number] = true;
}

const part1 = () => {
  for (let i = 0; i < input.length; i++) {
    const number1 = input[i];
    const number2 = 2020 - number1;
    if (map[number2]) {
      return number1 * number2;
    }
  }
};

const part2 = () => {
  for (let i = 0; i < input.length; i++) {
    const number1 = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const number2 = input[j];
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

console.log('part1', part1());
console.log('part2', part2());
