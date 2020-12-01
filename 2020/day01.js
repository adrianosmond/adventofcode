const input = require('./input01');

const part1 = () => {
  for (let i = 0; i < input.length; i++) {
    if (input.includes(2020 - input[i])) {
      return input[i] * (2020 - input[i]);
    }
  }
  throw new Error('Not found');
};

const part2 = () => {
  for (let i = 0; i < input.length; i++) {
    const number1 = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const number2 = input[j];
      const number3 = 2020 - (number1 + number2);

      if (input.includes(number3)) {
        return number1 * number2 * number3;
      }
    }
  }
  throw new Error('Not found');
};

console.log('part1', part1());
console.log('part2', part2());
