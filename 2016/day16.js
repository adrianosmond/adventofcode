import readInput from '../utils/readInput.js';

const input = readInput();

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

export const part1 = () => {
  const len = 272;
  const extended = dragon(input, len);
  const cs = checksum(extended, len);
  return cs;
};

export const part2 = () => {
  const len = 35651584;
  const extended = dragon(input, len);
  const cs = checksum(extended, len);
  return cs;
};
