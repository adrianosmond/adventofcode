const fs = require('fs');
const path = require('path');
const { sum } = require('../utils/reducers');

const input = fs.readFileSync(path.resolve(__dirname, 'input08.txt'), 'utf8');

const puzzle = input.split('\n').map((row) => {
  const [sample, code] = row.split(' | ');
  return [
    sample.split(' ').map((a) => a.split('').sort().join('')),
    code.split(' ').map((a) => a.split('').sort().join('')),
  ];
});

const part1 = () =>
  puzzle
    .map(
      ([, code]) =>
        code.filter((str) => [2, 3, 4, 7].includes(str.length)).length,
    )
    .reduce(sum);

const findDigits = (sample) => {
  const digits = new Array(10);
  digits[1] = sample.find((str) => str.length === 2);
  digits[7] = sample.find((str) => str.length === 3);
  digits[4] = sample.find((str) => str.length === 4);
  digits[8] = sample.find((str) => str.length === 7);

  digits[6] = sample.find(
    (str) =>
      str.length === 6 &&
      !digits[7].split('').every((char) => str.includes(char)),
  );

  digits[0] = sample.find(
    (str) =>
      str.length === 6 &&
      str !== digits[6] &&
      !digits[4].split('').every((char) => str.includes(char)),
  );

  digits[9] = sample.find(
    (str) => str.length === 6 && str !== digits[6] && str !== digits[0],
  );

  digits[3] = sample.find(
    (str) =>
      str.length === 5 &&
      digits[1].split('').every((char) => str.includes(char)),
  );

  digits[3] = sample.find(
    (str) =>
      str.length === 5 &&
      digits[1].split('').every((char) => str.includes(char)),
  );

  digits[5] = sample.find(
    (str) =>
      str.length === 5 &&
      str.split('').every((char) => digits[6].includes(char)),
  );

  digits[2] = sample.find(
    (str) => str.length === 5 && str !== digits[5] && str !== digits[3],
  );

  return digits;
};

const part2 = () =>
  puzzle.reduce((total, [sample, code]) => {
    const digits = findDigits(sample);
    return (
      total + parseInt(code.map((str) => digits.indexOf(str)).join(''), 10)
    );
  }, 0);

console.log('part1', part1());
console.log('part2', part2());
