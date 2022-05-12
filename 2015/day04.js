const fs = require('fs');
const path = require('path');
const md5 = require('../utils/md5');

const input = fs.readFileSync(path.resolve(__dirname, 'input04.txt'), 'utf8');

const findCoin = (start) => {
  let number = 1;
  while (true) {
    if (md5.hashBinary(`${input}${number}`).startsWith(start)) {
      break;
    }
    number++;
  }
  return number;
};

const part1 = () => findCoin('00000');

const part2 = () => findCoin('000000');

console.log('part1', part1());
console.log('part2', part2());
