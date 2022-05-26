import input from './input10.js';
import knotHash from './knotHash.js';

const day10part1 = (inputStr) => {
  const list = new Array(256).fill().map((_, i) => i);
  const inputArr = inputStr.split(',').map((d) => parseInt(d, 10));

  let pos = 0;
  let skip = 0;

  for (let j = 0; j < inputArr.length; j++) {
    const clone = list.slice(0);
    const len = inputArr[j];
    let end = pos + len - 1;
    if (end >= list.length) end -= list.length;

    for (let i = 0; i < len; i++) {
      let inverse = end - i;
      if (inverse < 0) inverse += list.length;
      list[(pos + i) % list.length] = clone[inverse];
    }
    pos += len + skip;
    pos %= list.length;
    skip++;
  }
  return list[0] * list[1];
};

console.log('part1:', day10part1(input));
console.log('part2:', knotHash(input));
