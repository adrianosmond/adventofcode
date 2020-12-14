const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input02.txt'), 'utf8');

const passwords = input.split('\n').map((str) => {
  const [, num1, num2, letter, password] = str.match(
    /(\d+)-(\d+) ([a-z]): ([a-z]+)/,
  );
  return [parseInt(num1, 10), parseInt(num2, 10), letter, password];
});

const isValidPassword = (min, max, letter, password) => {
  const letterCount =
    password.length - password.replace(new RegExp(letter, 'g'), '').length;

  return letterCount >= min && letterCount <= max;
};

const isValidPassword2 = (pos1, pos2, letter, password) =>
  (password[pos1 - 1] === letter) ^ (password[pos2 - 1] === letter);

const part1 = () =>
  passwords.reduce(
    (total, pass) => total + (isValidPassword(...pass) ? 1 : 0),
    0,
  );

const part2 = () =>
  passwords.reduce(
    (total, pass) => total + (isValidPassword2(...pass) ? 1 : 0),
    0,
  );

console.log('part1', part1());
console.log('part2', part2());
