const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input15.txt'), 'utf8');

const numbers = input.split(',').map((n) => parseInt(n, 10));

const getNthNumber = (maxTurn) => {
  const history = new Array(maxTurn);
  let spoken;
  let lastSpoken;

  for (let turn = 0; turn < maxTurn; turn++) {
    lastSpoken = spoken;
    if (turn < numbers.length) {
      spoken = numbers[turn];
    } else if (typeof history[lastSpoken] !== 'undefined') {
      spoken = turn - history[lastSpoken];
    } else {
      spoken = 0;
    }

    history[lastSpoken] = turn;
  }

  return spoken;
};

const part1 = () => getNthNumber(2020);
const part2 = () => getNthNumber(30000000);

console.log('part1', part1());
console.log('part2', part2());
