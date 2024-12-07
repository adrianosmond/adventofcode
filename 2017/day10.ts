import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import knotHash from './knotHash.ts';

const input = readInput();

const hash = (inputStr: string) => {
  const list = new Array(256).fill(0).map((_, i) => i);
  const inputArr = strToIntArray(inputStr, ',');

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

export const part1 = () => hash(input);

export const part2 = () => knotHash(input);
