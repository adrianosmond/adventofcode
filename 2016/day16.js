const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.resolve(__dirname, 'input16.txt'), 'utf8');

const extend = (a) => {
  const b = a
    .split('')
    .reverse()
    .map((char) => (char === '0' ? '1' : '0'))
    .join('');

  return `${a}0${b}`;
};

const dragon = (str, len) => {
  while (str.length < len) {
    str = extend(str);
  }
  return str;
};

const checksum = (str, len) => {
  let result = str.substr(0, len);
  while (result.length % 2 === 0) {
    let next = '';
    for (let i = 1; i < result.length; i += 2) {
      next += result[i] === result[i - 1] ? '1' : '0';
    }
    result = next;
  }
  return result;
};

const part1 = () => {
  const len = 272;
  const extended = dragon(input, len);
  const cs = checksum(extended, len);
  return cs;
};

const part2 = () => {
  const len = 35651584;
  const extended = dragon(input, len);
  const cs = checksum(extended, len);
  return cs;
};

console.log('part1', part1());
console.log('part2', part2());
