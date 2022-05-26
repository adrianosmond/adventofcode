import input from './input04.js';

const [from, to] = input;
const matches = [0, 0];

const testPassword = (password) => {
  let number = password;
  let lastDigit = 9;

  const freq = new Array(10).fill(0);
  while (number > 1) {
    const digit = number % 10;
    freq[digit] += 1;
    if (digit > lastDigit) {
      return [false, false];
    }
    number = (number - digit) / 10;
    lastDigit = digit;
  }
  return [Math.max(...freq) > 1, freq.indexOf(2) >= 0];
};

for (let i = from; i <= to; i++) {
  const [ascendingWithConsecutive, ascendingWithStrictDouble] = testPassword(i);
  matches[0] += ascendingWithConsecutive ? 1 : 0;
  matches[1] += ascendingWithStrictDouble ? 1 : 0;
}

console.log('part1:', matches[0]);
console.log('part2:', matches[1]);
