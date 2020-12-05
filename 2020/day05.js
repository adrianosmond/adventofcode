const fs = require('fs');
const path = require('path');

const input = fs
  .readFileSync(path.resolve(__dirname, 'input05.txt'), 'utf8')
  .replace(/[FL]/g, '0')
  .replace(/[BR]/g, '1')
  .split('\n')
  .map((ticket) => {
    const row = parseInt(ticket.substr(0, 7), 2);
    const col = parseInt(ticket.substr(7, 3), 2);
    return row * 8 + col;
  })
  .sort((a, b) => a - b);

const part1 = () => input[input.length - 1];

const part2 = () => {
  for (let i = 1; i < input.length; i++) {
    if (input[i] - input[i - 1] > 1) {
      return input[i] - 1;
    }
  }
};

console.log('part1', part1());
console.log('part2', part2());
